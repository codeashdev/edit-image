import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useImageStore } from "@/store/image-store";
import type { MouseEvent } from "react";

interface EditFeaturesProps {
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
}

type EditAction = "replace" | "recolor" | "background" | "relight";

export function EditFeatures({ isLoading, setIsLoading }: EditFeaturesProps) {
	const { toast } = useToast();
	const { image, setEditedImage } = useImageStore();
	const [prompt, setPrompt] = useState("");
	const [currentAction, setCurrentAction] = useState<EditAction | null>(null);

	const handleEdit = async (action: EditAction) => {
		if (!image) {
			toast({
				title: "No image selected",
				description: "Please upload an image first.",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsLoading(true);
			setCurrentAction(action);
			console.log("Sending edit request:", { action, prompt });

			const response = await fetch("/api/edit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageUrl: image,
					action,
					prompt,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to edit image");
			}

			if (!data.artifacts?.[0]?.base64) {
				throw new Error("No image data received from API");
			}

			setEditedImage(`data:image/png;base64,${data.artifacts[0].base64}`);

			toast({
				title: "Success",
				description: "Image edited successfully!",
			});
		} catch (error) {
			console.error("Edit error:", error);
			toast({
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "Failed to edit image. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
			setCurrentAction(null);
		}
	};

	const handleButtonClick =
		(action: EditAction) => (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			handleEdit(action);
		};

	const getButtonText = (action: EditAction, defaultText: string) => {
		if (isLoading && currentAction === action) {
			return "Processing...";
		}
		return defaultText;
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Input
					type="text"
					placeholder="Enter your edit prompt..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					disabled={isLoading}
				/>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Button
					variant="outline"
					onClick={handleButtonClick("replace")}
					disabled={isLoading || !prompt}
					className="w-full"
				>
					{getButtonText("replace", "Search & Replace")}
				</Button>
				<Button
					variant="outline"
					onClick={handleButtonClick("recolor")}
					disabled={isLoading || !prompt}
					className="w-full"
				>
					{getButtonText("recolor", "Search & Recolor")}
				</Button>
				<Button
					variant="outline"
					onClick={handleButtonClick("background")}
					disabled={isLoading}
					className="w-full"
				>
					{getButtonText("background", "Remove Background")}
				</Button>
				<Button
					variant="outline"
					onClick={handleButtonClick("relight")}
					disabled={isLoading || !prompt}
					className="w-full"
				>
					{getButtonText("relight", "Replace Background & Relight")}
				</Button>
			</div>
		</div>
	);
}
