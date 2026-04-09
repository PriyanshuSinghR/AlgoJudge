import { UserNav } from "./UserNav";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useAuth";

export function Navbar() {
	const { data: user, isLoading } = useCurrentUser();
	if (!isLoading) {
		console.log(user);
	}

	return (
		<header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-4 sm:mx-8 flex h-14 items-center">
				<div className="flex items-center space-x-4 lg:space-x-0">
					<h1 className="pl-5 text-[#2C2C2C]/60 font-semibold">Algo Judge</h1>
				</div>

				<div className="flex flex-1 items-center space-x-2 justify-end">
					{isLoading && <div className="text-sm">Loading...</div>}

					{!isLoading && !user && (
						<div className="flex gap-2">
							<Link to="/signin">
								<Button variant="outline">Sign In</Button>
							</Link>

							<Link to="/signup">
								<Button>Sign Up</Button>
							</Link>
						</div>
					)}

					{/* Logged in state */}
					{!isLoading && user && <UserNav user={user} />}
				</div>
			</div>
		</header>
	);
}
