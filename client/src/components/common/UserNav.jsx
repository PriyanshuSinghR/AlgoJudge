import { useNavigate } from "react-router-dom";
import { Home, User, LogOut, ChevronsUpDown, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSignOut } from "@/hooks/useAuth";

export function UserNav({ user }) {
	const { mutate: logout, isPending } = useSignOut();
	const navigate = useNavigate();

	const getAvatarFallback = () => {
		if (user?.name) {
			return user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		return "US";
	};

	if (!user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="group rounded-full focus:outline-none">
				<div className="relative">
					<div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-0 blur-md transition-all duration-300 group-hover:opacity-40 group-hover:scale-110" />

					<div className="relative rounded-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.45)]">
						<Avatar className="h-10 w-10 border-2 border-white shadow-md transition-all duration-300 group-hover:border-indigo-300 dark:border-zinc-800 dark:group-hover:border-indigo-500/50">
							<AvatarImage src={user?.profile?.avatar || "#"} alt="Avatar" />
							<AvatarFallback className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-sm font-bold text-white">
								{getAvatarFallback()}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-72 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-2 shadow-[0_20px_60px_rgba(99,102,241,0.18)] backdrop-blur-2xl dark:border-zinc-800 dark:bg-zinc-900/95"
			>
				<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4 text-white">
					<div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
					<div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-black/10 blur-2xl" />

					<div className="relative flex items-center gap-3">
						<Avatar className="h-12 w-12 border-2 border-white/20">
							<AvatarImage src={user?.profile?.avatar || "#"} alt="Avatar" />
							<AvatarFallback className="bg-white/15 text-sm font-bold text-white">
								{getAvatarFallback()}
							</AvatarFallback>
						</Avatar>

						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold text-white">
								{user.name}
							</p>

							<p className="truncate text-xs text-white/70">{user.email}</p>

							<div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/80">
								<Sparkles className="h-3 w-3" />
								Active Member
							</div>
						</div>
					</div>
				</div>

				<div className="mt-2 space-y-1">
					<DropdownMenuItem
						onClick={() => navigate("/profile")}
						className="group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-violet-50 hover:text-violet-600 focus:bg-violet-50 focus:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
					>
						<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-200 group-hover:bg-violet-100 group-hover:text-violet-600 dark:bg-zinc-800 dark:text-zinc-400">
							<User className="h-4 w-4" />
						</div>

						<div className="flex flex-col">
							<span>Account</span>
							<span className="text-xs font-normal text-slate-400 dark:text-zinc-500">
								Manage your profile
							</span>
						</div>
					</DropdownMenuItem>
				</div>

				<DropdownMenuSeparator className="my-2 bg-slate-200 dark:bg-zinc-800" />

				<DropdownMenuItem
					disabled={isPending}
					onClick={() => logout()}
					className="group flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 dark:hover:bg-red-500/10"
				>
					<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all duration-200 group-hover:bg-red-100 dark:bg-red-500/10">
						<LogOut className="h-4 w-4" />
					</div>

					<div className="flex flex-col">
						<span>{isPending ? "Logging out..." : "Logout"}</span>
						<span className="text-xs font-normal text-slate-400 dark:text-zinc-500">
							End current session
						</span>
					</div>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
