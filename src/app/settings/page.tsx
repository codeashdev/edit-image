import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { auth } from "@/lib/auth";
import { UserSettings } from "@/components/user-settings";

export const metadata = {
	title: "Settings - Image Editor",
	description: "Manage your account settings",
};

export default async function SettingsPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/signin");
	}

	const user = session.user ? {
		id: session.user.id,
		name: session.user.name ?? null,
		email: session.user.email ?? null,
		image: session.user.image ?? null,
	} : null;

	return (
		<Shell>
			<div className="container py-8">
				<div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
					<div className="grid gap-1">
						<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
						<p className="text-lg text-muted-foreground">
							Manage your account settings
						</p>
					</div>
				</div>
				<div className="mt-8">
					{user ? (
						<UserSettings user={user} />
					) : (
						<div className="text-red-500">User information is not available.</div>
					)}
				</div>
			</div>
		</Shell>
	);
}
