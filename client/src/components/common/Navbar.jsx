import { UserNav } from "./UserNav";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";
import { Code2, LayoutGrid, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
	const { data: user, isLoading } = useCurrentUser();
	const location = useLocation();

	const redirectUrl = encodeURIComponent(location.pathname);

	const navItems = [
		{
			label: "Problems",
			href: "/problems",
			icon: LayoutGrid,
		},
		{
			label: "Compiler",
			href: "/compiler",
			icon: Code2,
		},
	];

	return (
		<header className="sticky top-0 z-50 px-4 pt-4">
			<div className="mx-auto flex h-16 max-w-[1400px] items-center rounded-3xl border border-white/50 bg-white/70 px-4 sm:px-6 shadow-[0_8px_30px_rgba(99,102,241,0.12)] backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
				<div className="flex w-full items-center justify-between gap-4">
					<div className="min-w-[220px] flex items-center">
						<Link to="/" className="group flex items-center gap-3">
							<div>
								<h1 className="text-base font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-700 to-violet-700 bg-clip-text text-transparent dark:from-white dark:via-indigo-300 dark:to-violet-400">
									Algo Judge
								</h1>
								<p className="text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400 dark:text-zinc-500">
									Code • Solve • Win
								</p>
							</div>
						</Link>
					</div>

					<div className="flex flex-1 justify-center">
						<nav className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/70 p-1.5 shadow-inner dark:border-zinc-800 dark:bg-zinc-900/60">
							{navItems.map((item) => {
								const Icon = item.icon;

								const isActive =
									location.pathname === item.href ||
									location.pathname.startsWith(`${item.href}/`);

								return (
									<Link key={item.href} to={item.href}>
										<div
											className={cn(
												"group relative flex items-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300",
												isActive
													? "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/25"
													: "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white",
											)}
										>
											<Icon className="h-4 w-4" />
											<span>{item.label}</span>

											{isActive && (
												<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_50%)]" />
											)}
										</div>
									</Link>
								);
							})}
						</nav>
					</div>

					<div className="min-w-[220px] flex items-center justify-end gap-3">
						{isLoading && (
							<div className="text-sm text-slate-400 animate-pulse dark:text-zinc-500">
								Loading...
							</div>
						)}

						{!isLoading && !user && (
							<div className="flex items-center gap-2">
								<Link to={`/signin?redirect=${redirectUrl}`}>
									<Button
										variant="ghost"
										className="rounded-2xl border border-transparent px-5 text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white"
									>
										Sign In
									</Button>
								</Link>

								<Link to={`/signup?redirect=${redirectUrl}`}>
									<Button className="group rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/30">
										<span>Get Started</span>
										<ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
									</Button>
								</Link>
							</div>
						)}

						{!isLoading && user && <UserNav user={user} />}
					</div>
				</div>
			</div>
		</header>
	);
}
