import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const { name } = body;

		if (!name) {
			return new NextResponse("Name is required", { status: 400 });
		}

		const user = await db.user.update({
			where: {
				id: session.user.id,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.error("[USER_PATCH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
