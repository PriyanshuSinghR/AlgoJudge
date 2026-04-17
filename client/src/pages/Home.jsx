import { Link } from "react-router-dom";
import {
	ArrowRight,
	Sparkles,
	Terminal,
	Brain,
	Trophy,
	Zap,
	Play,
	CheckCircle2,
	Flame,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
	{
		title: "Smart Problem Solving",
		description:
			"Solve curated coding challenges with smooth editor, console, hints, and instant judge feedback.",
		icon: Brain,
		gradient: "from-indigo-500 to-violet-500",
	},
	{
		title: "Multi Language Compiler",
		description:
			"Run C++, JavaScript, Python and Java with blazing-fast execution.",
		icon: Terminal,
		gradient: "from-violet-500 to-pink-500",
	},
	{
		title: "Track Your Journey",
		description:
			"Monitor streaks, solve history, rankings, and daily coding consistency.",
		icon: Trophy,
		gradient: "from-pink-500 to-rose-500",
	},
];

const highlights = [
	"Beautiful coding interface",
	"Instant test case execution",
	"Company-style coding rounds",
	"Contest mode and rankings",
];

export default function HomePage() {
	return (
		<div className="space-y-8 pb-10">
			<section className="relative overflow-hidden rounded-[40px] border border-slate-200/70 bg-white/80 px-6 py-8 shadow-[0_20px_80px_-20px_rgba(99,102,241,0.18)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 sm:px-10 sm:py-12">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.14),transparent_35%)]" />

				<div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
				<div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-pink-500/10 blur-3xl" />

				<div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					<div>
						<Badge className="rounded-full border-0 bg-indigo-500/10 px-4 py-1 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
							<Sparkles className="mr-2 h-3.5 w-3.5" />
							Next Generation Coding Platform
						</Badge>

						<h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-6xl">
							Code harder.
							<br />
							<span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
								Win faster.
							</span>
						</h1>

						<p className="mt-6 max-w-2xl text-base leading-8 text-slate-500 dark:text-zinc-400 sm:text-lg">
							Master algorithms, sharpen problem solving, and compete with
							developers across the world in one beautiful platform.
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							<Link to="/problems">
								<Button className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 text-white shadow-lg shadow-indigo-500/20">
									Start Solving
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>

							<Link to="/compiler">
								<Button
									variant="outline"
									className="h-12 rounded-2xl border-slate-200 bg-white/70 px-6 dark:border-zinc-700 dark:bg-zinc-900/50"
								>
									<Play className="mr-2 h-4 w-4" />
									Try Compiler
								</Button>
							</Link>
						</div>

						<div className="mt-10 grid gap-3 sm:grid-cols-2">
							{highlights.map((item) => (
								<div
									key={item}
									className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60"
								>
									<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
										<CheckCircle2 className="h-4 w-4" />
									</div>
									<span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
										{item}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-pink-500/20 blur-3xl" />

						<Card className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-slate-950 text-white shadow-2xl dark:border-zinc-800">
							<CardContent className="p-0">
								<div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
									<div className="flex items-center gap-2">
										<div className="h-3 w-3 rounded-full bg-red-500" />
										<div className="h-3 w-3 rounded-full bg-yellow-500" />
										<div className="h-3 w-3 rounded-full bg-green-500" />
									</div>
								</div>

								<div className="space-y-4 p-6 font-mono text-sm">
									<div className="text-indigo-400">// Two Sum</div>
									<div className="text-white/80">
										function twoSum(nums, target) {"{"}
									</div>
									<div className="pl-5 text-white/60">
										const map = new Map();
									</div>
									<div className="pl-5 text-white/60">
										for (let i = 0; i {"<"} nums.length; i++) {"{"}
									</div>
									<div className="pl-10 text-white/60">
										const diff = target - nums[i];
									</div>
									<div className="pl-10 text-emerald-400">
										if (map.has(diff)) return [map.get(diff), i];
									</div>
									<div className="pl-10 text-white/60">
										map.set(nums[i], i);
									</div>
									<div className="pl-5 text-white/60">{"}"}</div>
									<div className="text-white/80">{"}"}</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section className="grid gap-6 lg:grid-cols-3">
				{features.map((feature) => {
					const Icon = feature.icon;

					return (
						<Card
							key={feature.title}
							className="group overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(99,102,241,0.25)] dark:border-zinc-800 dark:bg-zinc-900/70"
						>
							<CardContent className="p-7">
								<div
									className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}
								>
									<Icon className="h-6 w-6" />
								</div>

								<h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
									{feature.title}
								</h3>

								<p className="mt-3 text-sm leading-7 text-slate-500 dark:text-zinc-400">
									{feature.description}
								</p>
							</CardContent>
						</Card>
					);
				})}
			</section>

			<section className="rounded-[40px] border border-slate-200/70 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 px-8 py-10 text-white shadow-[0_20px_80px_-20px_rgba(99,102,241,0.35)] dark:border-zinc-800 sm:px-12">
				<div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<Badge className="border-0 bg-white/10 text-white">
							<Flame className="mr-2 h-3.5 w-3.5" />
							Daily Coding Streak
						</Badge>

						<h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
							Ready to become unstoppable?
						</h2>

						<p className="mt-4 max-w-2xl text-base leading-8 text-white/65">
							Build consistency, solve harder problems, and become
							interview-ready with daily practice.
						</p>
					</div>

					<Link to="/problems">
						<Button className="h-12 rounded-2xl bg-white px-6 text-slate-900 hover:bg-slate-100">
							<Zap className="mr-2 h-4 w-4" />
							Explore Problems
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}
