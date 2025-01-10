import { Shell } from "@/components/shell";
import { ImageGrid } from "@/components/image-grid";

export const metadata = {
	title: "Gallery - Image Editor",
	description: "Browse all edited images",
};

export default function GalleryPage() {
	return (
		<Shell>
			<div className="container py-8">
				<div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
					<div className="grid gap-1">
						<h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
						<p className="text-lg text-muted-foreground">
							Browse all edited images
						</p>
					</div>
				</div>
				<div className="mt-8">
					<ImageGrid />
				</div>
			</div>
		</Shell>
	);
}
