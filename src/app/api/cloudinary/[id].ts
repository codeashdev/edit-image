// src/pages/api/cloudinary/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const {
		query: { id },
		method,
	} = req;

	if (method === "DELETE") {
		try {
			// Remove the image from Cloudinary
			await cloudinary.uploader.destroy(String(id)); // Ensure id is a string
			return res.status(204).end(); // No content
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.json({ message: "Failed to remove image from Cloudinary" });
		}
	} else {
		// Handle any other HTTP method
		res.setHeader("Allow", ["DELETE"]);
		return res.status(405).end(`Method ${method} Not Allowed`);
	}
}
