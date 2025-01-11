import { NextResponse } from "next/server";
import FormData from "form-data";

async function getImageBuffer(url: string): Promise<Buffer> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch image: ${response.statusText}`);
		}
		const arrayBuffer = await response.arrayBuffer();
		return Buffer.from(arrayBuffer);
	} catch (error) {
		console.error("Error in getImageBuffer:", error);
		throw new Error("Failed to process image URL");
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { action, imageUrl, prompt } = body;

		// Validate inputs
		if (!imageUrl || !action) {
			return NextResponse.json(
				{ error: "Image URL and action are required" },
				{ status: 400 },
			);
		}

		// Supported actions
		const validActions = [
			"remove-background",
			"search-and-replace",
			"search-and-recolor",
			"replace-background-and-relight",
		];

		if (!validActions.includes(action)) {
			return NextResponse.json(
				{
					error: `Unsupported action. Supported actions are: ${validActions.join(", ")}`,
				},
				{ status: 400 },
			);
		}

		// Fetch the image buffer
		const imageBuffer = await getImageBuffer(imageUrl);

		// Construct the FormData payload
		const formData = new FormData();
		if (action === "replace-background-and-relight") {
			formData.append("subject_image", imageBuffer, {
				filename: "subject.png",
			});
			formData.append("background_prompt", prompt || "default background");
		} else {
			formData.append("image", imageBuffer, { filename: "image.png" });
			formData.append("prompt", prompt || "");
		}

		formData.append("output_format", "webp");

		// Stability AI endpoint
		const endpoint = `https://api.stability.ai/v2beta/stable-image/edit/${action}`;
		const headers: HeadersInit = {
			Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
		};

		// Set Accept header for image-based responses
		if (action !== "replace-background-and-relight") {
			headers.Accept = "image/*";
		}

		// Send the request to Stability AI
		const response = await fetch(endpoint, {
			method: "POST",
			headers,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			body: formData as any, // Type assertion here
		});

		// Handle non-OK responses
		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			console.error("API Error Response:", errorData);
			return NextResponse.json(
				{ error: errorData?.message || "Failed to edit image" },
				{ status: response.status },
			);
		}

		// Handle successful responses for background-and-relight action
		if (action === "replace-background-and-relight") {
			const responseData = await response.json();
			return NextResponse.json({ generationId: responseData.id });
		}

		// Handle image response
		const imageData = await response.arrayBuffer();
		const base64Image = Buffer.from(imageData).toString("base64");
		return NextResponse.json({
			image: `data:image/webp;base64,${base64Image}`,
		});
	} catch (error) {
		// Handle unexpected errors
		console.error("Edit error:", error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to process image",
			},
			{ status: 500 },
		);
	}
}
