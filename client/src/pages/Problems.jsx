// src/pages/Problems.jsx
import { useProblems } from "@/hooks/useProblems";
import { useCurrentUser } from "@/hooks/useAuth";

import ProblemsTable from "@/components/problems/ProblemsTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function ProblemsPage() {
	const navigate = useNavigate();
	const { data: problems, isLoading } = useProblems();
	const { data: user } = useCurrentUser();

	if (isLoading) return <div className="p-4">Loading...</div>;

	return (
		<div className="p-6 max-w-5xl mx-auto space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Problems</h1>

				{user && (
					<Button onClick={() => navigate("/create-problem")}>
						Create Problem
					</Button>
				)}
			</div>

			<ProblemsTable problems={problems} user={user} />
		</div>
	);
}
