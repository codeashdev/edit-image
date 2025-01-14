import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const { imageUrl, featureType } = body;

		if (!imageUrl) {
			return new NextResponse("Image URL is required", { status: 400 });
		}

		if (!featureType) {
			return new NextResponse("Feature type is required", { status: 400 });
		}

		const image = await db.image.create({
			data: {
				imageUrl,
				featureType,
				userId: session.user.id,
			},
		});

		return NextResponse.json(image);
	} catch (error) {
		console.error("[IMAGES_POST]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function GET(req: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const images = await db.image.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(images);
	} catch (error) {
		console.error("[IMAGES_GET]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { id } = await req.json(); // Use req.json() to parse the body
		if (!id) {
			return NextResponse.json({ message: "ID is required" }, { status: 400 });
		}

		const deletedImage = await db.image.delete({
			where: { id: String(id) },
		});

		if (!deletedImage) {
			return NextResponse.json({ message: "Image not found" }, { status: 404 });
		}

		// Correctly return status 204 (No Content) with no body
		return new NextResponse(null, { status: 204 }); // No content
	} catch (error) {
		console.error("Error deleting image:", error);
		return NextResponse.json(
			{
				message: "Failed to remove image from database",
				error: (error as Error).message,
			},
			{ status: 500 },
		);
	}
}
