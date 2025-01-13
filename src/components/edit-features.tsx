import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useImageStore } from "@/store/image-store";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import axios from "axios";
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

const ACTION_LABELS: Record<EditActionApi, string> = {
	"search-and-replace": "Search and Replace",
	"search-and-recolor": "Search and Recolor",
	"remove-background": "Remove Background",
	"replace-background-and-relight": "Replace Background & Relight",
};

export function EditFeatures({ isLoading, setIsLoading }: EditFeaturesProps) {
	const { toast } = useToast();
	const { image, setEditedImage } = useImageStore();
	const [currentAction, setCurrentAction] = useState<EditActionApi | null>(
		null,
	);
	const [prompt, setPrompt] = useState("");
	const [searchPrompt, setSearchPrompt] = useState("");
	const [selectPrompt, setSelectPrompt] = useState("");

	// Reset inputs when action changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		setPrompt("");
		setSearchPrompt("");
		setSelectPrompt("");
	}, [currentAction]);

	const handleEdit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!currentAction) return;

		if (!image) {
			toast({
				title: "No image selected",
				description: "Please upload an image first.",
				variant: "destructive",
			});
			return;
		}

		// Validate required inputs
		if (currentAction === "search-and-replace" && (!prompt || !searchPrompt)) {
			toast({
				title: "Missing input",
				description:
					"Please enter both what to search for and what to replace it with.",
				variant: "destructive",
			});
			return;
		}

		if (currentAction === "search-and-recolor" && (!prompt || !selectPrompt)) {
			toast({
				title: "Missing input",
				description:
					"Please enter both what to recolor and the new color/style.",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsLoading(true);

			const requestBody = {
				imageUrl: image,
				action: currentAction,
				prompt,
				searchPrompt,
				selectPrompt,
				backgroundPrompt:
					currentAction === "replace-background-and-relight"
						? prompt
						: undefined,
			};

			const response = await axios.post("/api/edit", requestBody);

			if (currentAction === "replace-background-and-relight") {
				toast({
					title: "Success",
					description: `Generation ID: ${response.data.generationId}`,
				});
			} else {
				if (!response.data.image) {
					throw new Error("No image data received from server");
				}

				setEditedImage(response.data.image);
				toast({
					title: "Success",
					description: "Image edited successfully!",
				});
			}

			// Reset after success
			setCurrentAction(null);
			setPrompt("");
			setSearchPrompt("");
			setSelectPrompt("");
		} catch (error) {
			console.error("Edit error:", error);
			let errorMessage = "Failed to edit image. Please try again.";
			if (axios.isAxiosError(error)) {
				errorMessage = error.response?.data?.error || errorMessage;
			}
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const renderInputs = () => {
		if (!currentAction) return null;

		return (
			<div className="space-y-4">
				{currentAction === "remove-background" ? (
					<p className="text-sm text-muted-foreground">
						Click the button below to remove the background from your image.
					</p>
				) : (
					<div className="space-y-2">
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
						<Input
							type="text"
							placeholder={
								currentAction === "search-and-replace"
									? "Enter what to replace with..."
									: currentAction === "search-and-recolor"
										? "Enter new color/style..."
										: "Enter background description..."
							}
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							disabled={isLoading}
						/>
					</div>
				)}
				<Button
					className="w-full"
					onClick={handleEdit}
					disabled={
						isLoading ||
						(currentAction === "search-and-replace" &&
							(!prompt || !searchPrompt)) ||
						(currentAction === "search-and-recolor" &&
							(!prompt || !selectPrompt)) ||
						(currentAction === "replace-background-and-relight" && !prompt)
					}
				>
					{isLoading
						? "Processing..."
						: `Apply ${ACTION_LABELS[currentAction]}`}
				</Button>
			</div>
		);
	};

	return (
		<div className="space-y-4">
			<Select
				onValueChange={(value: EditActionApi) => setCurrentAction(value)}
				value={currentAction || undefined}
				disabled={!image} // Add this line to disable when there's no image
			>
				<SelectTrigger>
					<SelectValue
						placeholder={
							!image
								? "Upload an image first..."
								: "Select an action to perform..."
						}
					/>
				</SelectTrigger>
				<SelectContent>
					{Object.entries(ACTION_LABELS).map(([value, label]) => (
						<SelectItem key={value} value={value}>
							{label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{renderInputs()}
		</div>
	);
}
