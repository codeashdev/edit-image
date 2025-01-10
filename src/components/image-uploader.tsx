import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
	onUpload: (file: File) => void;
	isLoading: boolean;
}

export function ImageUploader({ onUpload, isLoading }: ImageUploaderProps) {
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (acceptedFiles.length > 0) {
				onUpload(acceptedFiles[0]);
			}
		},
		[onUpload],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"],
		},
		maxFiles: 1,
		multiple: false,
	});

	return (
		<div
			{...getRootProps()}
			className={cn(
				"flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center",
				isDragActive
					? "border-primary bg-primary/10"
					: "border-muted-foreground/25 hover:bg-accent hover:text-accent-foreground",
				isLoading && "pointer-events-none opacity-60",
			)}
		>
			<input {...getInputProps()} />
			<Upload className="mb-4 h-8 w-8" />
			<h3 className="mb-2 text-lg font-medium">Drag & Drop your image here</h3>
			<p className="mb-4 text-sm text-muted-foreground">
				or click to select a file
			</p>
			<Button variant="outline" disabled={isLoading}>
				Select Image
			</Button>
		</div>
	);
}
