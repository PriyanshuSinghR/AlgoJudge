import { useLocation, useParams } from "react-router-dom";
import { useProblemBySlug } from "@/hooks/useProblems";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_CODE } from "@/lib/constant";
import { useRunProblem, useSubmitProblem } from "@/hooks/useConsole";
import { useCurrentUser } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";

const MONACO_LANG = {
	javascript: "javascript",
	python: "python",
	java: "java",
	cpp: "cpp",
};

const DIFFICULTY_STYLES = {
	easy: "bg-green-50 text-green-800 border-green-200",
	medium: "bg-amber-50 text-amber-800 border-amber-200",
	hard: "bg-red-50 text-red-800 border-red-200",
};

export default function SingleProblemPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const { mutate: runCode, isPending: isRunning } = useRunProblem();
	const { mutate: submitCode, isPending: isSubmitting } = useSubmitProblem();
	const { data: user } = useCurrentUser();
	const { data: problem, isLoading } = useProblemBySlug(slug);
	const editorRef = useRef(null);
	const [language, setLanguage] = useState("javascript");
	const [codeMap, setCodeMap] = useState(DEFAULT_CODE);
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [runStatus, setRunStatus] = useState("");
	const [saveLabel, setSaveLabel] = useState("Auto-saved");
	const [outputColor, setOutputColor] = useState("text-muted-foreground");

	useEffect(() => {
		const saved = localStorage.getItem(`code-${slug}`);
		if (saved) setCodeMap(JSON.parse(saved));
	}, [slug]);

	useEffect(() => {
		const timer = setTimeout(() => {
			localStorage.setItem(`code-${slug}`, JSON.stringify(codeMap));
			setSaveLabel("Saved just now");
			setTimeout(() => setSaveLabel("Auto-saved"), 2000);
		}, 800);
		return () => clearTimeout(timer);
	}, [codeMap, slug]);

	useEffect(() => {
		const savedLang = localStorage.getItem("selected-lang");
		if (savedLang) setLanguage(savedLang);
	}, []);

	useEffect(() => {
		localStorage.setItem("selected-lang", language);
	}, [language]);

	const handleCodeChange = (value) => {
		setCodeMap((prev) => ({ ...prev, [language]: value ?? "" }));
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
						setOutput(result.data || "No output");
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

	const handleSubmit = () => {
		setRunStatus("Judging...");
		setOutput("Running hidden test cases...");
		setOutputColor("text-muted-foreground");

		submitCode(
			{
				problemId: problem._id,
				language,
				code: codeMap[language],
			},
			{
				onSuccess: (response) => {
					const result = response?.data;

					if (!result?.success) {
						setOutput(result?.message || "Submission failed");
						setOutputColor("text-red-600");
						setRunStatus("Submission Failed");
						return;
					}

					if (result.status === "Accepted") {
						setOutput(
							`✓ All ${result.totalTestCases} test cases passed\n\n${result.message}`,
						);
						setOutputColor("text-green-600");
						setRunStatus("Accepted");
						return;
					}

					if (result.status === "Wrong Answer") {
						setOutput(
							`✗ Wrong Answer on test case #${result.failedTestCase}

Input:
${result.input}

Expected Output:
${result.expectedOutput}

Your Output:
${result.actualOutput}`,
						);
						setOutputColor("text-red-600");
						setRunStatus("Wrong Answer");
						return;
					}

					if (result.status === "Runtime Error") {
						setOutput(
							`⚠ Runtime Error on test case #${result.failedTestCase}

${result.error}`,
						);
						setOutputColor("text-red-600");
						setRunStatus("Runtime Error");
						return;
					}

					setOutput("Unknown submission result");
					setOutputColor("text-red-600");
					setRunStatus("Error");
				},
				onError: (error) => {
					setOutput(
						error?.response?.data?.message ||
							error?.message ||
							"Something went wrong while submitting code",
					);
					setOutputColor("text-red-600");
					setRunStatus("Submission Failed");
				},
			},
		);
	};

	const handleLanguageChange = (lang) => {
		setLanguage(lang);

		setCodeMap((prev) => ({
			...prev,
			[lang]: prev[lang] || DEFAULT_CODE[lang],
		}));
	};

	const handleEditorWheel = (e) => {
		const editor = editorRef.current;
		if (!editor) return;

		const scrollTop = editor.getScrollTop();
		const scrollHeight = editor.getScrollHeight();
		const editorHeight = editor.getLayoutInfo().height;

		const maxScrollTop = scrollHeight - editorHeight;
		const deltaY = e.deltaY;

		const isScrollingDown = deltaY > 0;
		const isScrollingUp = deltaY < 0;

		const atTop = scrollTop <= 0;
		const atBottom = scrollTop >= maxScrollTop - 2;

		const canEditorScrollDown = isScrollingDown && !atBottom;
		const canEditorScrollUp = isScrollingUp && !atTop;

		if (canEditorScrollDown || canEditorScrollUp) {
			e.stopPropagation();
			return;
		}
	};

	if (isLoading) {
		return (
			<div className="h-[calc(100vh-44px)] flex items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
					<p className="text-sm text-muted-foreground">Loading problem...</p>
				</div>
			</div>
		);
	}

	if (!problem) {
		return (
			<div className="h-[calc(100vh-44px)] flex items-center justify-center">
				<p className="text-muted-foreground">Problem not found</p>
			</div>
		);
	}

	const constraints = problem.constraints
		? problem.constraints.split("\n").filter(Boolean)
		: [];

	return (
		<div className="h-[calc(100vh-150px)] overflow-hidden px-2 py-1">
			<div className="grid h-full gap-5 xl:grid-cols-[430px_minmax(0,1fr)]">
				<div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-white/90 via-white/75 to-white/50  backdrop-blur-2xl dark:border-zinc-800 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-950/20">
					<div className="shrink-0 border-b border-slate-100 p-6 dark:border-zinc-800">
						<div className="relative border-b border-slate-100 p-6 dark:border-zinc-800">
							<div className="relative">
								<button
									onClick={() => navigate("/problems")}
									className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
								>
									<ChevronLeft className="h-4 w-4" />
									Back to Problems
								</button>

								<div className="mb-4 flex items-center gap-3">
									<div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white ">
										<span className="text-lg font-bold">
											{problem.title?.charAt(0)}
										</span>
									</div>

									<div>
										<p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400 dark:text-zinc-500">
											Problem #{problem.id ?? "42"}
										</p>

										<h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
											{problem.title}
										</h1>
									</div>
								</div>

								<div className="flex flex-wrap items-center gap-2">
									<Badge
										className={cn(
											"rounded-full border px-3 py-1 text-xs font-semibold capitalize",
											DIFFICULTY_STYLES[problem.difficulty],
										)}
									>
										{problem.difficulty}
									</Badge>

									{problem.tags?.map((tag) => (
										<div
											key={tag}
											className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
										>
											{tag}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700">
						<div className="space-y-6">
							<div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
								<p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
									Description
								</p>

								<p className="text-sm leading-7 text-slate-600 dark:text-zinc-300">
									{problem.description}
								</p>
							</div>

							{problem.examples?.length > 0 && (
								<div className="space-y-4">
									<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
										Examples
									</p>

									{problem.examples.map((ex, i) => (
										<div
											key={i}
											className="overflow-hidden rounded-[24px] border border-slate-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/40"
										>
											<div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
												<p className="text-sm font-semibold text-slate-900 dark:text-white">
													Example {i + 1}
												</p>

												<div className="rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
													Sample
												</div>
											</div>

											<div className="space-y-4 p-5">
												<div>
													<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
														Input
													</p>

													<pre className="overflow-x-auto rounded-2xl bg-slate-100 p-4 font-mono text-xs text-slate-700 dark:bg-zinc-900 dark:text-zinc-300">
														{ex.input}
													</pre>
												</div>

												<div>
													<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
														Output
													</p>

													<pre className="overflow-x-auto rounded-2xl bg-slate-100 p-4 font-mono text-xs text-slate-700 dark:bg-zinc-900 dark:text-zinc-300">
														{ex.output}
													</pre>
												</div>

												{ex.explanation && (
													<div>
														<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
															Explanation
														</p>

														<div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm leading-6 text-slate-600 dark:border-indigo-500/20 dark:bg-indigo-500/5 dark:text-zinc-300">
															{ex.explanation}
														</div>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							)}

							{constraints.length > 0 && (
								<div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
									<p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
										Constraints
									</p>

									<div className="space-y-2">
										{constraints.map((constraint, index) => (
											<div
												key={index}
												className="flex items-start gap-3 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-zinc-900"
											>
												<div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-500" />
												<code className="font-mono text-xs text-slate-700 dark:text-zinc-300">
													{constraint}
												</code>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex h-full min-h-0 flex-col overflow-hidden">
					<div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700">
						<div className="flex min-h-full flex-col gap-5">
							<div className="relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-white/90 via-white/75 to-white/50 backdrop-blur-2xl dark:border-zinc-800 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-950/20">
								<div className="relative flex flex-wrap items-center gap-3 border-b border-slate-100 p-5 dark:border-zinc-800">
									<Select value={language} onValueChange={handleLanguageChange}>
										<SelectTrigger className="!h-12 w-[190px] rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium shadow-none dark:border-zinc-700 dark:bg-zinc-900">
											<SelectValue />
										</SelectTrigger>

										<SelectContent
											sideOffset={6}
											align="center"
											className="w-[190px] rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-900"
										>
											<SelectItem
												className="rounded-xl px-3 py-2"
												value="javascript"
											>
												JavaScript
											</SelectItem>
											<SelectItem
												className="rounded-xl px-3 py-2"
												value="python"
											>
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

									<div className="ml-auto flex flex-wrap items-center gap-3">
										<div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
											{saveLabel}
										</div>

										<Button
											variant="outline"
											className="h-12 rounded-2xl border-slate-200 bg-white px-5 text-sm font-medium hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900"
											onClick={() =>
												setCodeMap((prev) => ({
													...prev,
													[language]: DEFAULT_CODE[language],
												}))
											}
										>
											Reset
										</Button>

										<Button
											variant="outline"
											onClick={handleRun}
											disabled={isRunning}
											className="h-12 rounded-2xl border-indigo-200 bg-indigo-50 px-5 text-sm font-medium text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300"
										>
											{isRunning ? "Running..." : "Run Code"}
										</Button>

										{user ? (
											<Button
												onClick={handleSubmit}
												disabled={isSubmitting}
												className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-medium text-white "
											>
												{isSubmitting ? "Submitting..." : "Submit"}
											</Button>
										) : (
											<Button
												onClick={() =>
													navigate(
														`/signin?redirect=${encodeURIComponent(location.pathname)}`,
													)
												}
												className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-medium text-white "
											>
												Signin to Submit
											</Button>
										)}
									</div>
								</div>

								<div className="p-5">
									<div
										className="overflow-hidden rounded-[28px] border border-slate-200 bg-black shadow-inner dark:border-zinc-700"
										onWheel={handleEditorWheel}
									>
										<Editor
											onMount={(editor) => {
												editorRef.current = editor;
											}}
											height="540px"
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
												fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
												fontLigatures: true,
												tabSize: 4,
												renderLineHighlight: "line",
												cursorBlinking: "smooth",
												smoothScrolling: true,
												mouseWheelScrollSensitivity: 1,
												fastScrollSensitivity: 5,
												alwaysConsumeMouseWheel: false,
												scrollbar: {
													verticalScrollbarSize: 10,
													horizontalScrollbarSize: 10,
													alwaysConsumeMouseWheel: false,
													useShadows: false,
												},
												overviewRulerBorder: false,
												hideCursorInOverviewRuler: true,
											}}
										/>
									</div>
								</div>
							</div>

							<div className="grid gap-5 pb-1 xl:grid-cols-2">
								<div className="overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-white/90 via-white/70 to-cyan-50/40  backdrop-blur-xl dark:border-zinc-800 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-cyan-950/10">
									<div className="border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
										<p className="text-sm font-semibold text-slate-900 dark:text-white">
											Custom Input
										</p>
									</div>

									<div className="p-0">
										<Textarea
											value={input}
											onChange={(e) => setInput(e.target.value)}
											placeholder="Enter your custom input here..."
											className="h-[230px] w-full resize-none rounded-b-2xl rounded-t-none border-0 border-t border-slate-200 bg-slate-50 p-4 font-mono text-xs shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-950"
										/>
									</div>
								</div>

								<div className="overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-white/90 via-white/70 to-violet-50/40  backdrop-blur-xl dark:border-zinc-800 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-violet-950/10">
									<div className="border-b border-slate-100 px-5 py-4 dark:border-zinc-800">
										<div className="flex items-center justify-between">
											<p className="text-sm font-semibold text-slate-900 dark:text-white">
												Output
											</p>

											{runStatus && (
												<div
													className={cn(
														"rounded-full px-3 py-1 text-[11px] font-medium",
														runStatus === "Accepted" ||
															runStatus === "Run Successful"
															? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300"
															: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300",
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
				</div>
			</div>
		</div>
	);
}
