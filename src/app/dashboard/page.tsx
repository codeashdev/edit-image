import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { ImageGrid } from "@/components/image-grid";
import { auth } from "@/lib/auth";

export const metadata = {
	title: "Dashboard - Image Editor",
	description: "View and manage your edited images",
};

export default async function DashboardPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<Shell>
			<div className="container py-8">
				<div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
					<div className="grid gap-1">
						<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
						<p className="text-lg text-muted-foreground">
							View and manage your edited images
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
