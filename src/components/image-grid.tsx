"use client";

import { useEffect, useState } from "react";
import { ImageViewer } from "@/components/image-viewer";
import { useToast } from "@/components/ui/use-toast";

interface Image {
	id: string;
	imageUrl: string;
	featureType: string;
	createdAt: string;
}

export function ImageGrid() {
	const { toast } = useToast();
	const [images, setImages] = useState<Image[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch("/api/images");
				if (!response.ok) throw new Error("Failed to fetch images");
				const data = await response.json();
				setImages(data);
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to load images. Please try again.",
					variant: "destructive",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchImages();
	}, [toast]);

	if (isLoading) {
		return (
			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, index) => (
					<div
						key={`placeholder-${index + 1}`}
						className="aspect-square animate-pulse rounded-lg bg-muted"
					/>
				))}
			</div>
		);
	}

	if (images.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center space-y-4 py-12">
				<p className="text-lg font-medium">No images found</p>
				<p className="text-sm text-muted-foreground">
					Start editing images to see them here
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{images.map((image) => (
				<div key={image.id} className="group relative">
					<ImageViewer src={image.imageUrl} />
					<div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
						<span className="rounded-full bg-background/90 px-2 py-1 text-xs font-medium">
							{image.featureType}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
