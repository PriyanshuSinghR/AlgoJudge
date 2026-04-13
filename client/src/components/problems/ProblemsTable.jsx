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
import { ActionAlert } from "../common/ActionAlert";
import { useToast } from "@/hooks/useToast";
import { Trash2 } from "lucide-react";

export default function ProblemsTable({ problems, user }) {
	const toast = useToast();
	const navigate = useNavigate();
	const { mutate: deleteProblem } = useDeleteProblem();

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

	const handleUpdate = (e, id) => {
		e.stopPropagation();
		navigate(`/edit-problem/${id}`);
	};

	const handleDelete = (id) => {
		deleteProblem(id, {
			onSuccess: () => {
				toast.success("Problem deleted successfully");
				navigate(`/problems`);
			},
			onError: () => {
				toast.error("Failed to delete problem");
			},
		});
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

								<TableCell onClick={(e) => e.stopPropagation()}>
									{isOwner ? (
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={(e) => handleUpdate(e, problem._id)}
											>
												Edit
											</Button>
											<ActionAlert
												title="Delete Problem?"
												description="This action cannot be undone."
												confirmText="Delete"
												variant="destructive"
												onConfirm={() => handleDelete(problem._id)}
											>
												<div className="inline-flex items-center justify-center rounded-md border border-red-200 p-2 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer">
													<Trash2 size={13} />
												</div>
											</ActionAlert>
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
