"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();

	return (
		<nav
			className={cn("flex items-center space-x-4 lg:space-x-6", className)}
			{...props}
		>
			<Link
				href="/"
				className={cn(
					"text-sm font-medium text-muted-foreground transition-colors",
					{
						"hover:text-primary": pathname !== "/",
						"text-primary": pathname === "/",
					},
				)}
			>
				Home
			</Link>
			<Link
				href="/dashboard"
				className={cn(
					"text-sm font-medium text-muted-foreground transition-colors",
					{
						"hover:text-primary": pathname !== "/dashboard",
						"text-primary": pathname === "/dashboard",
					},
				)}
			>
				Dashboard
			</Link>
			<Link
				href="/gallery"
				className={cn(
					"text-sm font-medium text-muted-foreground transition-colors",
					{
						"hover:text-primary": pathname !== "/gallery",
						"text-primary": pathname === "/gallery",
					},
				)}
			>
				Gallery
			</Link>
		</nav>
	);
}
