import { Header } from "@/components/header";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className={cn("flex-1", className)} {...props}>
				{children}
			</main>
		</div>
	);
}
