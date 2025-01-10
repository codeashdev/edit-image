import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Image Editor - Powered by Stability AI",
	description: "A powerful image editor using Stability AI's API",
	icons: {
		icon: [
			{
				url: "/icon.png",
				href: "/icon.png",
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					inter.className,
					"min-h-screen bg-background antialiased",
				)}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
