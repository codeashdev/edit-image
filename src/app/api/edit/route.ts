import { NextResponse } from "next/server";

type EditAction = "replace" | "recolor" | "background" | "relight";

interface RequestBody {
	init_image: string;
	init_image_mode: string;
	image_strength: number;
	samples: number;
	steps: number;
	cfg_scale: number;
	seed: number;
	text_prompts: Array<{
		text: string;
		weight: number;
	}>;
}

async function getBase64FromUrl(url: string): Promise<string> {
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	const base64 = Buffer.from(buffer).toString("base64");
	return base64;
}

export async function POST(req: Request) {
	try {
		const { imageUrl, action, prompt } = await req.json();

		if (!imageUrl || !action) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		// For actions that require a prompt
		if (["replace", "recolor", "relight"].includes(action) && !prompt) {
			return NextResponse.json(
				{ error: "Prompt is required for this action" },
				{ status: 400 },
			);
		}

		// Get base64 image data
		const base64Image = await getBase64FromUrl(imageUrl);

		const endpoint =
			action === "background"
				? "https://api.stability.ai/v1/generation/image-to-image/upscale"
				: "https://api.stability.ai/v1/generation/image-to-image";

		const requestBody: RequestBody = {
			init_image: base64Image,
			init_image_mode: "IMAGE_STRENGTH",
			image_strength: 0.35,
			samples: 1,
			steps: 30,
			cfg_scale: 7,
			seed: 0,
			text_prompts: [],
		};

		switch (action) {
			case "replace":
				requestBody.text_prompts = [
					{
						text: prompt,
						weight: 1,
					},
				];
				break;

			case "recolor":
				requestBody.text_prompts = [
					{
						text: `${prompt} color style`,
						weight: 1,
					},
				];
				break;

			case "background":
				requestBody.text_prompts = [
					{
						text: "remove background, transparent background",
						weight: 1,
					},
				];
				break;

			case "relight":
				requestBody.text_prompts = [
					{
						text: prompt || "adjust lighting and replace background",
						weight: 1,
					},
				];
				break;

			default:
				return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}

		console.log("Sending request to Stability AI:", {
			endpoint,
			action,
			prompt,
			imageSize: base64Image.length,
		});

		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
				Accept: "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		if (!response.ok) {
			const error = await response.json();
			console.error("Stability AI error:", error);
			throw new Error(error.message || "Failed to edit image");
		}

		const result = await response.json();
		return NextResponse.json(result);
	} catch (error) {
		console.error("Edit error:", error);
		return NextResponse.json(
			{ error: "Failed to edit image" },
			{ status: 500 },
		);
	}
}
