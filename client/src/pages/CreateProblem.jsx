// CreateProblemPage.jsx
import ProblemForm from "@/components/problems/ProblemForm";
import { useCreateProblem } from "@/hooks/useProblems";
import { useNavigate } from "react-router-dom";
import { Sparkles, FileCode2 } from "lucide-react";

export default function CreateProblemPage() {
	const { mutate: createProblem, isPending } = useCreateProblem();
	const navigate = useNavigate();

	const handleSubmit = (data) => {
		const payload = {
			...data,
			slug: data.title.toLowerCase().replace(/ /g, "-"),
			tags: data.tags.split(",").map((t) => t.trim()),
		};

		createProblem(payload, {
			onSuccess: () => navigate(`/problem/${payload.slug}`),
		});
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
							Problem Creator
						</div>

						<h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
							Create New Problem
						</h1>

						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
							Build coding challenges with examples, constraints and hidden test
							cases.
						</p>
					</div>

					<div className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
								<FileCode2 className="h-5 w-5" />
							</div>

							<div>
								<p className="text-2xl font-bold text-slate-900 dark:text-white">
									New
								</p>
								<p className="text-xs text-slate-500 dark:text-zinc-400">
									Problem Draft
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ProblemForm
				defaultValues={{
					title: "",
					description: "",
					difficulty: "easy",
					tags: "",
					constraints: "",
					examples: [],
					testCases: [],
				}}
				onSubmit={handleSubmit}
				isSubmitting={isPending}
			/>
		</div>
	);
}
