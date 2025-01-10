import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
	title: "Sign In - Image Editor",
	description: "Sign in to your account",
};

export default function SignInPage() {
	return (
		<Shell>
			<div className="container flex h-[calc(100vh-8rem)] w-screen flex-col items-center justify-center">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Welcome back
						</h1>
						<p className="text-sm text-muted-foreground">
							Sign in to your account to continue
						</p>
					</div>
					<UserAuthForm />
				</div>
			</div>
		</Shell>
	);
}
