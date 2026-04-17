import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Code2, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_CODE } from "@/lib/constant";
import { useRunProblem } from "@/hooks/useConsole";
import { Textarea } from "@/components/ui/textarea";

const MONACO_LANG = {
	javascript: "javascript",
	python: "python",
	java: "java",
	cpp: "cpp",
};

export default function CompilerPage() {
	const { mutate: runCode, isPending: isRunning } = useRunProblem();

	const [language, setLanguage] = useState("javascript");
	const [codeMap, setCodeMap] = useState(DEFAULT_CODE);
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [runStatus, setRunStatus] = useState("");
	const [outputColor, setOutputColor] = useState("text-muted-foreground");

	const handleCodeChange = (value) => {
		setCodeMap((prev) => ({
			...prev,
			[language]: value ?? "",
		}));
	};

	const handleLanguageChange = (lang) => {
		setLanguage(lang);

		setCodeMap((prev) => ({
			...prev,
			[lang]: prev[lang] || DEFAULT_CODE[lang],
		}));

		setOutput("");
		setRunStatus("");
	};

	const handleRun = () => {
		setRunStatus("Running...");
		setOutput("");
		setOutputColor("text-muted-foreground");

		runCode(
			{
				language,
				code: codeMap[language],
				input,
			},
			{
				onSuccess: (response) => {
					const result = response?.data;

					if (result?.success) {
						setOutput(result?.data || "No output");
						setOutputColor("text-green-600");
						setRunStatus("Run Successful");
					} else {
						setOutput(result?.error || "Something went wrong");
						setOutputColor("text-red-600");
						setRunStatus("Run Failed");
					}
				},
				onError: (error) => {
					setOutput(
						error?.response?.data?.message ||
							error?.message ||
							"Something went wrong while running code",
					);
					setOutputColor("text-red-600");
					setRunStatus("Runtime Error");
				},
			},
		);
	};

	return (
		<div className="space-y-5">
			<div className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/70 p-6 shadow-[0_10px_40px_rgba(99,102,241,0.12)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
				<div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />

				<div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
							<Code2 className="h-3.5 w-3.5" />
							Interactive Playground
						</div>

						<h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
							Online Compiler
						</h1>

						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-zinc-400">
							Write, run and test your code instantly with multiple language
							support.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<Select value={language} onValueChange={handleLanguageChange}>
							<SelectTrigger className="!h-12 w-[190px] rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium shadow-none dark:border-zinc-700 dark:bg-zinc-900">
								<SelectValue />
							</SelectTrigger>

							<SelectContent
								sideOffset={6}
								align="center"
								className="w-[190px] rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-900"
							>
								<SelectItem className="rounded-xl px-3 py-2" value="javascript">
									JavaScript
								</SelectItem>
								<SelectItem className="rounded-xl px-3 py-2" value="python">
									Python
								</SelectItem>
								<SelectItem className="rounded-xl px-3 py-2" value="java">
									Java
								</SelectItem>
								<SelectItem className="rounded-xl px-3 py-2" value="cpp">
									C++
								</SelectItem>
							</SelectContent>
						</Select>

						<Button
							variant="outline"
							className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-sm font-medium hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900"
							onClick={() => {
								setCodeMap((prev) => ({
									...prev,
									[language]: DEFAULT_CODE[language],
								}));
								setOutput("");
								setRunStatus("");
							}}
						>
							<RotateCcw className="mr-2 h-4 w-4" />
							Reset
						</Button>

						<Button
							onClick={handleRun}
							disabled={isRunning}
							className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
						>
							<Play className="mr-2 h-4 w-4" />
							{isRunning ? "Running..." : "Run Code"}
						</Button>
					</div>
				</div>
			</div>

			<div className="grid gap-5 xl:grid-cols-[1fr_380px]">
				<div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
					<div className="border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-semibold text-slate-900 dark:text-white">
									Code Editor
								</p>
								<p className="text-xs text-slate-500 dark:text-zinc-400">
									Write your solution here
								</p>
							</div>

							<div className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-medium capitalize text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
								{language}
							</div>
						</div>
					</div>

					<div className="h-[560px] p-4">
						<div className="h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-zinc-700">
							<Editor
								height="100%"
								language={MONACO_LANG[language]}
								value={codeMap[language]}
								onChange={handleCodeChange}
								theme="vs-dark"
								options={{
									fontSize: 14,
									lineHeight: 24,
									minimap: { enabled: false },
									scrollBeyondLastLine: false,
									padding: { top: 16, bottom: 16 },
									fontFamily:
										"'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
									fontLigatures: true,
									tabSize: 4,
									renderLineHighlight: "line",
									cursorBlinking: "smooth",
									smoothScrolling: true,
									overviewRulerBorder: false,
								}}
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-5">
					<div className="overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
						<div className="border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
							<p className="text-sm font-semibold text-slate-900 dark:text-white">
								Custom Input
							</p>
							<p className="text-xs text-slate-500 dark:text-zinc-400">
								Provide stdin values for your code
							</p>
						</div>

						<div className="p-0">
							<Textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Enter your custom input here..."
								className="h-[240px] w-full resize-none rounded-b-2xl rounded-t-none border-0 border-t border-slate-200 bg-slate-50 p-4 font-mono text-xs shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-950"
							/>
						</div>
					</div>

					<div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
						<div className="border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-semibold text-slate-900 dark:text-white">
										Output
									</p>
									<p className="text-xs text-slate-500 dark:text-zinc-400">
										Result from your code execution
									</p>
								</div>

								{runStatus && (
									<div
										className={cn(
											"rounded-full px-3 py-1 text-[11px] font-medium",
											runStatus === "Run Successful"
												? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300"
												: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300",
										)}
									>
										{runStatus}
									</div>
								)}
							</div>
						</div>

						<div className="p-0">
							<div
								className={cn(
									"h-[230px] overflow-y-auto  rounded-b-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs whitespace-pre-wrap dark:border-zinc-700 dark:bg-zinc-950",
									outputColor,
								)}
							>
								{output || "Run your code to see output here"}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
