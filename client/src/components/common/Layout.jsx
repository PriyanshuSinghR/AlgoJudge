import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useAuth";
import { Navbar } from "./Navbar";

export default function Layout({ children, permission }) {
	const { data: user, isLoading } = useCurrentUser();

	if (isLoading) return null;

	if (permission === "guest" && user) return <Navigate to="/" replace />;
	if (permission === "protected" && !user)
		return <Navigate to="/signin" replace />;
	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-zinc-50 via-indigo-50/30 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
			<Navbar />

			<main className="min-h-[calc(100vh-80px)] px-4 pb-4 pt-5">
				<div className="mx-auto max-w-[1400px] animate-fadeIn">{children}</div>
			</main>
		</div>
	);
}
