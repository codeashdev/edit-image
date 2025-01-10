import { ImageEditor } from "@/components/image-editor";
import { Shell } from "@/components/shell";

export default function HomePage() {
	return (
		<Shell>
			<div className="container py-8">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
						Image Editor
					</h1>
					<p className="max-w-[600px] text-muted-foreground">
						A powerful image editor powered by Stability AI. Edit your images
						with advanced AI features like object removal, background
						replacement, and more.
					</p>
				</div>
				<div className="mt-8">
					<ImageEditor />
				</div>
			</div>
		</Shell>
	);
}
