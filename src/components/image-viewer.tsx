import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";

interface ImageViewerProps extends React.HTMLAttributes<HTMLDivElement> {
	src: string;
}

export function ImageViewer({ src, className, ...props }: ImageViewerProps) {
	return (
		<div
			className={cn(
				"relative aspect-square overflow-hidden rounded-lg border",
				className,
			)}
			{...props}
		>
			<Zoom>
				<Image
					src={src}
					alt="Image preview"
					className="object-cover"
					quality={100}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					priority
				/>
			</Zoom>
		</div>
	);
}
