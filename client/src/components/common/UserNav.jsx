import { Link, useNavigate } from "react-router-dom";

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
			<DropdownMenuTrigger className="relative h-8 w-8 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center focus:outline-none">
				<Avatar className="h-8 w-8">
					<AvatarImage src={user?.profile?.avatar || "#"} alt="Avatar" />
					<AvatarFallback>{getAvatarFallback()}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{user.name}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{user.email}
							</p>
						</div>
					</DropdownMenuLabel>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem
						className="hover:cursor-pointer"
						onClick={() => navigate("/")}
					>
						Home
					</DropdownMenuItem>
					<DropdownMenuItem
						className="hover:cursor-pointer"
						onClick={() => navigate("/profile")}
					>
						Account
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					className="hover:cursor-pointer"
					disabled={isPending}
					onClick={() => logout()}
				>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
