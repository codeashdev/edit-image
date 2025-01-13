"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-uploader";
import { ImageViewer } from "@/components/image-viewer";
import { EditFeatures } from "@/components/edit-features";
import { useToast } from "@/components/ui/use-toast";
import { useImageStore } from "@/store/image-store";
import { TrashIcon } from "lucide-react";

export function ImageEditor() {
	const { data: session } = useSession();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const { image, setImage, editedImage, setEditedImage } = useImageStore();

	const handleImageUpload = async (file: File) => {
		try {
			setIsLoading(true);
			// Upload image to Cloudinary
			const formData = new FormData();
			formData.append("file", file);
			formData.append("upload_preset", "edit_image");
			formData.append(
				"cloud_name",
				process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
			);

			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
				{
					method: "POST",
					body: formData,
				},
			);

			if (!response.ok) {
				const error = await response.json();
				console.error("Cloudinary error:", error);
				throw new Error(error.message || "Failed to upload image");
			}

			const data = await response.json();
			setImage(data.secure_url);
		} catch (error) {
			console.error("Upload error:", error);
			toast({
				title: "Error",
				description: "Failed to upload image. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSaveImage = async () => {
		if (!session) {
			toast({
				title: "Authentication required",
				description: "Please sign in to save your edited images.",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsLoading(true);
			const response = await fetch("/api/images", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imageUrl: editedImage,
					featureType: "edit",
				}),
			});

			if (!response.ok) throw new Error("Failed to save image");

			toast({
				title: "Success",
				description: "Image saved successfully!",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to save image. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveImage = () => {
		setImage(""); // Clear the uploaded image
		setEditedImage(""); // Clear the edited image if needed
	};

	const handleRemoveEditedImage = () => {
		setEditedImage(""); // Clear the edited image if needed
	};

	// console.log(editedImage);

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<div className="space-y-4">
				<ImageUploader onUpload={handleImageUpload} isLoading={isLoading} />
				{image && (
					<div className="relative">
						<div className="absolute top-0 right-0 z-10">
							<button
								onClick={handleRemoveImage}
								type="button"
								className="p-2 rounded-full bg-red-600 bg-opacity-75 text-white hover:bg-red-700"
							>
								<TrashIcon />
							</button>
						</div>
						<ImageViewer src={image} />
					</div>
				)}
			</div>
			<div className="space-y-4">
				<EditFeatures isLoading={isLoading} setIsLoading={setIsLoading} />
				{editedImage && (
					<div className="space-y-4 relative">
						<div className="absolute top-0 right-0 z-10">
							<button
								onClick={handleRemoveEditedImage}
								type="button"
								className="p-2 rounded-full bg-red-600 bg-opacity-75 text-white hover:bg-red-700"
							>
								<TrashIcon />
							</button>
						</div>
						<ImageViewer src={editedImage} />

						<div className="flex justify-center">
							<Button onClick={handleSaveImage} disabled={isLoading}>
								Save Image
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
