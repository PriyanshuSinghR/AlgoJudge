// src/components/problems/ProblemsTable.jsx
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
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";

export default function ProblemsTable({ problems, user }) {
	const toast = useToast();
	const navigate = useNavigate();
	const { mutate: deleteProblem } = useDeleteProblem();

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case "easy":
				return "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300";
			case "medium":
				return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300";
			case "hard":
				return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300";
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
				navigate("/problems");
			},
			onError: () => {
				toast.error("Failed to delete problem");
			},
		});
	};

	return (
		<div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
			<Table>
				<TableHeader>
					<TableRow className="border-b border-slate-100 dark:border-zinc-800 hover:bg-transparent">
						<TableHead className="h-14 pl-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
							Problem
						</TableHead>
						<TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
							Difficulty
						</TableHead>

						<TableHead className="pr-6 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{problems?.map((problem, index) => {
						const isOwner = user && problem.createdBy === user._id;

						return (
							<TableRow
								key={problem._id}
								className="group cursor-pointer border-b border-slate-100/80 transition-all duration-200 hover:bg-indigo-50/40 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
								onClick={() => navigate(`/problems/${problem.slug}`)}
							>
								<TableCell className="py-5 pl-6">
									<div className="flex items-center gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
											{index + 1}
										</div>

										<div>
											<div className="flex items-center gap-2">
												<p className="font-semibold text-slate-900 dark:text-white">
													{problem.title}
												</p>
												<ArrowUpRight className="h-4 w-4 text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
											</div>

											<p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
												Click to open and solve problem
											</p>
										</div>
									</div>
								</TableCell>

								<TableCell>
									<Badge
										className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getDifficultyColor(
											problem.difficulty,
										)}`}
									>
										{problem.difficulty}
									</Badge>
								</TableCell>

								<TableCell
									className="pr-6"
									onClick={(e) => e.stopPropagation()}
								>
									{isOwner ? (
										<div className="flex items-center justify-end gap-2">
											<Button
												size="sm"
												variant="outline"
												className="inline-flex h-9 w-9 items-center justify-center rounded-xl border  border-green-200 text-green-500 transition-all duration-200 hover:bg-green-500 hover:text-white dark:border-red-500/20"
												onClick={(e) => handleUpdate(e, problem._id)}
											>
												<Pencil size={14} />
											</Button>

											<ActionAlert
												title="Delete Problem?"
												description="This action cannot be undone."
												confirmText="Delete"
												variant="destructive"
												onConfirm={() => handleDelete(problem._id)}
											>
												<div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white dark:border-red-500/20">
													<Trash2 size={14} />
												</div>
											</ActionAlert>
										</div>
									) : (
										<div className="text-right text-sm text-slate-400 dark:text-zinc-500">
											—
										</div>
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
