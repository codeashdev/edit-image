import { NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

async function getImageBuffer(url: string): Promise<Buffer> {
	try {
		const response = await axios.get(url, {
			responseType: "arraybuffer",
		});
		return Buffer.from(response.data);
	} catch (error) {
		console.error("Error in getImageBuffer:", error);
		throw new Error("Failed to process image URL");
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const {
			action,
			imageUrl,
			prompt,
			searchPrompt,
			selectPrompt,
			backgroundPrompt,
		} = body;

		console.log("Received request:", {
			action,
			prompt,
			searchPrompt,
			selectPrompt,
			backgroundPrompt,
		});

		if (!imageUrl || !action) {
			return NextResponse.json(
				{ error: "Image URL and action are required" },
				{ status: 400 },
			);
		}

		// Validate required parameters for specific actions
		if (action === "search-and-replace" && (!prompt || !searchPrompt)) {
			return NextResponse.json(
				{
					error:
						"Both prompt and searchPrompt are required for search-and-replace",
				},
				{ status: 400 },
			);
		}

		if (action === "search-and-recolor" && (!prompt || !selectPrompt)) {
			return NextResponse.json(
				{
					error:
						"Both prompt and selectPrompt are required for search-and-recolor",
				},
				{ status: 400 },
			);
		}

		const imageBuffer = await getImageBuffer(imageUrl);
		const formData = new FormData();

		// Configure payload based on action
		switch (action) {
			case "replace-background-and-relight":
				formData.append("subject_image", imageBuffer, {
					filename: "image.png",
				});
				formData.append("background_prompt", backgroundPrompt || prompt || "");
				break;

			case "search-and-replace":
				formData.append("image", imageBuffer, { filename: "image.png" });
				formData.append("prompt", prompt);
				formData.append("search_prompt", searchPrompt);
				break;

			case "search-and-recolor":
				formData.append("image", imageBuffer, { filename: "image.png" });
				formData.append("prompt", prompt);
				formData.append("select_prompt", selectPrompt);
				break;

			case "remove-background":
				formData.append("image", imageBuffer, { filename: "image.png" });
				break;
		}

		formData.append("output_format", "webp");

		console.log("Sending request to Stability AI with params:", {
			action,
			hasImage: !!imageBuffer,
			prompt,
			searchPrompt,
			selectPrompt,
			backgroundPrompt,
		});

		const endpoint = `https://api.stability.ai/v2beta/stable-image/edit/${action}`;

		const response = await axios.postForm(endpoint, formData, {
			validateStatus: undefined,
			responseType: "arraybuffer",
			headers: {
				Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
				...(action !== "replace-background-and-relight" && {
					Accept: "image/*",
				}),
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status !== 200) {
			let errorMessage: string;
			try {
				// Try to parse error message from arraybuffer
				errorMessage = Buffer.from(response.data).toString();
			} catch (e) {
				errorMessage = "Failed to edit image";
			}
			console.error(`API Error: ${response.status}`, errorMessage);
			return NextResponse.json(
				{ error: errorMessage },
				{ status: response.status },
			);
		}

		if (action === "replace-background-and-relight") {
			return NextResponse.json({ generationId: response.data.id });
		}

		const base64Image = Buffer.from(response.data).toString("base64");
		return NextResponse.json({
			image: `data:image/webp;base64,${base64Image}`,
		});
	} catch (error) {
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
