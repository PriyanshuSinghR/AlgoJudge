// src/pages/Problems.jsx
import { useMemo, useState } from "react";
import { useProblems } from "@/hooks/useProblems";
import { useCurrentUser } from "@/hooks/useAuth";
import ProblemsTable from "@/components/problems/ProblemsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Sparkles, Code2, Filter } from "lucide-react";

export default function ProblemsPage() {
	const navigate = useNavigate();
	const { data: problems, isLoading } = useProblems();
	const { data: user } = useCurrentUser();

	const [search, setSearch] = useState("");
	const [difficulty, setDifficulty] = useState("all");

	const filteredProblems = useMemo(() => {
		if (!problems) return [];

		return problems.filter((problem) => {
			const matchesSearch = problem.title
				.toLowerCase()
				.includes(search.toLowerCase());

			const matchesDifficulty =
				difficulty === "all" || problem.difficulty.toLowerCase() === difficulty;

			return matchesSearch && matchesDifficulty;
		});
	}, [problems, search, difficulty]);

	if (isLoading) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="h-10 w-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
					<p className="text-sm text-muted-foreground">Loading problems...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-8 shadow-[0_10px_40px_rgba(99,102,241,0.12)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
				<div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />

				<div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
							<Sparkles className="h-3.5 w-3.5" />
							Coding Playground
						</div>

						<h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
							Explore Problems
						</h1>

						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
							Sharpen your coding skills with curated problems across different
							topics and difficulty levels.
						</p>
					</div>

					{user && (
						<Button
							onClick={() => navigate("/create-problem")}
							className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
						>
							<Plus className="mr-2 h-4 w-4" />
							Create Problem
						</Button>
					)}
				</div>
			</div>

			<div className="rounded-[28px] border border-white/60 bg-white/70 p-5 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="relative w-full lg:max-w-sm">
						<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search problems..."
							className="h-12 rounded-2xl border-slate-200 bg-white pl-11 shadow-none focus-visible:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950"
						/>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-zinc-400">
							<Filter className="h-4 w-4" />
							Filter
						</div>

						<Select value={difficulty} onValueChange={setDifficulty}>
							<SelectTrigger className="h-12 w-[180px] rounded-2xl border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-950">
								<SelectValue placeholder="Difficulty" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="all">All Difficulties</SelectItem>
								<SelectItem value="easy">Easy</SelectItem>
								<SelectItem value="medium">Medium</SelectItem>
								<SelectItem value="hard">Hard</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<ProblemsTable problems={filteredProblems} user={user} />
		</div>
	);
}
