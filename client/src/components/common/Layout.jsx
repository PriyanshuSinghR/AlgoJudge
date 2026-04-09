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
		<div className="w-full min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
			<Navbar />
			<main className="min-h-screen">
				<div className="animate-fadeIn">{children}</div>
			</main>
		</div>
	);
}
