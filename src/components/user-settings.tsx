"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface UserSettingsProps {
	user: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
	};
}

export function UserSettings({ user }: UserSettingsProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [name, setName] = useState(user.name || "");

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			const response = await fetch("/api/user", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			});

			if (!response.ok) throw new Error("Failed to update profile");

			toast({
				title: "Success",
				description: "Your profile has been updated.",
			});
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update profile. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleUpdateProfile} className="space-y-8">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						placeholder="Enter your name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isLoading}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="Enter your email"
						value={user.email || ""}
						disabled
					/>
					<p className="text-sm text-muted-foreground">
						Email cannot be changed
					</p>
				</div>
			</div>
			<Button type="submit" disabled={isLoading}>
				{isLoading ? "Saving..." : "Save Changes"}
			</Button>
		</form>
	);
}
