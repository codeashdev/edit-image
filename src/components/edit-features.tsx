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

type EditActionApi =
	| "search-and-replace"
	| "search-and-recolor"
	| "remove-background"
	| "replace-background-and-relight";

export function EditFeatures({ isLoading, setIsLoading }: EditFeaturesProps) {
	const { toast } = useToast();
	const { image, setEditedImage } = useImageStore();
	const [prompt, setPrompt] = useState("");
	const [searchPrompt, setSearchPrompt] = useState(""); // For search-and-replace
	const [selectPrompt, setSelectPrompt] = useState(""); // For search-and-recolor
	const [currentAction, setCurrentAction] = useState<EditActionApi | null>(
		null,
	);

	const handleEdit = async (action: EditActionApi) => {
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

			const requestBody = {
				imageUrl: image,
				action,
				...getActionSpecificParams(action),
			};

			console.log("Sending edit request:", requestBody);
			const response = await fetch("/api/edit", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestBody),
			});

			console.log("Response status:", response.status);
			const data = await response.json();
			console.log("Response data:", data);

			if (!response.ok) {
				throw new Error(data.error || "Failed to edit image");
			}

			if (!data.image) {
				throw new Error("No image data received from API");
			}

			setEditedImage(data.image);
			toast({
				title: "Success",
				description: "Image edited successfully!",
			});
			// Optionally clear inputs after success
			clearInputs();
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

	const clearInputs = () => {
		setPrompt("");
		setSearchPrompt("");
		setSelectPrompt("");
	};

	const getActionSpecificParams = (action: EditActionApi) => {
		switch (action) {
			case "search-and-replace":
				return {
					prompt,
					searchPrompt: searchPrompt || "object", // Default if not specified
				};
			case "search-and-recolor":
				return {
					prompt,
					selectPrompt: selectPrompt || "object", // Default if not specified
				};
			case "replace-background-and-relight":
				return {
					backgroundPrompt: prompt,
				};
			case "remove-background":
				return {};
			default:
				return {};
		}
	};

	const handleButtonClick =
		(action: EditActionApi) => (e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			handleEdit(action);
		};

	const getButtonText = (action: EditActionApi, defaultText: string) => {
		if (isLoading && currentAction === action) {
			return "Processing...";
		}
		return defaultText;
	};

	const getPromptPlaceholder = () => {
		switch (currentAction) {
			case "search-and-replace":
				return "Enter what to replace with...";
			case "search-and-recolor":
				return "Enter new color/style...";
			case "replace-background-and-relight":
				return "Enter background description...";
			default:
				return "Enter your edit prompt...";
		}
	};

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				{/* Prompt input */}
				<Input
					type="text"
					placeholder={getPromptPlaceholder()}
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					disabled={isLoading}
				/>
				{currentAction === "search-and-replace" && (
					<Input
						type="text"
						placeholder="What to search for (e.g., 'dog', 'car')..."
						value={searchPrompt}
						onChange={(e) => setSearchPrompt(e.target.value)}
						disabled={isLoading}
					/>
				)}
				{currentAction === "search-and-recolor" && (
					<Input
						type="text"
						placeholder="What to recolor (e.g., 'car', 'shirt')..."
						value={selectPrompt}
						onChange={(e) => setSelectPrompt(e.target.value)}
						disabled={isLoading}
					/>
				)}
			</div>
			<div className="grid grid-cols-2 gap-2">
				{/* Buttons */}
				<Button
					variant="outline"
					onClick={handleButtonClick("search-and-replace")}
					disabled={isLoading || !prompt}
					className="w-full"
				>
					{getButtonText("search-and-replace", "Search & Replace")}
				</Button>
				<Button
					variant="outline"
					onClick={handleButtonClick("search-and-recolor")}
					disabled={isLoading || !prompt}
					className="w-full"
				>
					{getButtonText("search-and-recolor", "Search & Recolor")}
				</Button>
				<Button
					variant="outline"
					onClick={handleButtonClick("remove-background")}
					disabled={isLoading}
					className="w-full"
				>
					{getButtonText("remove-background", "Remove Background")}
				</Button>
				<Button
					variant="outline"
					onClick={handleButtonClick("replace-background-and-relight")}
					disabled={isLoading || !prompt}
					className="w-full"
				>
					{getButtonText(
						"replace-background-and-relight",
						"Replace Background & Relight",
					)}
				</Button>
			</div>
		</div>
	);
}
