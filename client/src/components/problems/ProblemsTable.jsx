import { useNavigate } from "react-router-dom";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useDeleteProblem } from "@/hooks/useProblems";

export default function ProblemsTable({ problems, user }) {
	const navigate = useNavigate();
	const { mutate: deleteProblem, isPending } = useDeleteProblem();

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case "easy":
				return "bg-green-100 text-green-700";
			case "medium":
				return "bg-yellow-100 text-yellow-700";
			case "hard":
				return "bg-red-100 text-red-700";
			default:
				return "";
		}
	};

	const handleDelete = (e, id) => {
		e.stopPropagation(); // 🚨 prevent row click

		if (confirm("Are you sure you want to delete this problem?")) {
			deleteProblem(id);
		}
	};

	const handleUpdate = (e, id) => {
		e.stopPropagation();
		navigate(`/edit-problem/${id}`);
	};

	return (
		<div className="border rounded-lg overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[60%]">Title</TableHead>
						<TableHead>Difficulty</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{problems?.map((problem) => {
						const isOwner = user && problem.createdBy === user._id;

						return (
							<TableRow
								key={problem._id}
								className="cursor-pointer hover:bg-muted/50"
								onClick={() => navigate(`/problem/${problem.slug}`)}
							>
								<TableCell className="font-medium">{problem.title}</TableCell>

								<TableCell>
									<Badge className={getDifficultyColor(problem.difficulty)}>
										{problem.difficulty}
									</Badge>
								</TableCell>

								<TableCell>
									{isOwner ? (
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={(e) => handleUpdate(e, problem._id)}
											>
												Edit
											</Button>

											<Button
												size="sm"
												variant="destructive"
												disabled={isPending}
												onClick={(e) => handleDelete(e, problem._id)}
											>
												Delete
											</Button>
										</div>
									) : (
										<span className="text-muted-foreground text-sm">—</span>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
