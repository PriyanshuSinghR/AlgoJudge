import { useParams, useNavigate } from "react-router-dom";
import { useProblemById, useUpdateProblem } from "@/hooks/useProblems";
import ProblemForm from "@/components/problems/ProblemForm";
import { Sparkles, PencilLine, FilePenLine } from "lucide-react";

export default function EditProblemPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data: problem, isLoading } = useProblemById(id);
	const { mutate: updateProblem, isPending } = useUpdateProblem();

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="h-10 w-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
					<p className="text-sm text-muted-foreground">Loading problem...</p>
				</div>
			</div>
		);
	}

	const handleSubmit = (data) => {
		const payload = {
			...data,
			tags: data.tags.split(",").map((t) => t.trim()),
		};

		updateProblem(
			{ id, payload },
			{
				onSuccess: () => navigate("/problems"),
			},
		);
	};

	return (
		<div className="space-y-6">
			<div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-8 shadow-[0_10px_40px_rgba(99,102,241,0.12)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
				<div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />

				<div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
							<Sparkles className="h-3.5 w-3.5" />
							Problem Editor
						</div>

						<h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
							Edit Problem
						</h1>

						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
							Update problem details, examples, constraints and hidden test
							cases.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
							<FilePenLine className="h-5 w-5" />
						</div>

						<p className="max-w-[180px] truncate text-lg text-slate-500 dark:text-zinc-400">
							{problem?.title}
						</p>
					</div>
				</div>
			</div>

			<div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
				<div className="mb-6 flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
						<PencilLine className="h-5 w-5" />
					</div>

					<div>
						<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
							Update Problem Details
						</h2>
						<p className="text-sm text-slate-500 dark:text-zinc-400">
							Make changes and save the updated version of this problem.
						</p>
					</div>
				</div>

				<ProblemForm
					defaultValues={{
						...problem,
						tags: problem.tags.join(", "),
					}}
					onSubmit={handleSubmit}
					isSubmitting={isPending}
				/>
			</div>
		</div>
	);
}
