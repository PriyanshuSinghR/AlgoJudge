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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_CODE, LANGUAGES } from "@/lib/constant";
import {
	useRunProblem,
	useSubmissionHistory,
	useSubmitProblem,
} from "@/hooks/useConsole";
import { useCurrentUser } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, Clock3, AlertTriangle } from "lucide-react";
import { useExplainCode, useHint } from "@/hooks/useAI";
import AIContent from "@/components/problems/AIContent";

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
	const { data: submissionHistory = [], isLoading: isSubmissionLoading } =
		useSubmissionHistory(problem?._id, user);

	const { mutate: getHintAI, isPending: isGettingHint } = useHint();
	const { mutate: explainAI, isPending: isExplaining } = useExplainCode();

	const [activeMainTab, setActiveMainTab] = useState("io");
	const [activeAiTab, setActiveAiTab] = useState("hint1");

	const [hints, setHints] = useState({
		hint1: "",
		hint2: "",
		hint3: "",
		explain: "",
	});

	const [language, setLanguage] = useState(() => {
		return localStorage.getItem("selected-lang") || "javascript";
	});
	const [selectedSubmission, setSelectedSubmission] = useState(null);
	const [codeMap, setCodeMap] = useState(DEFAULT_CODE);
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [runStatus, setRunStatus] = useState("");
	const [saveLabel, setSaveLabel] = useState("Auto-saved");
	const [outputColor, setOutputColor] = useState("text-muted-foreground");
	const savedCodeMapRef = useRef({});
	const previousUserRef = useRef(user);

	useEffect(() => {
		const saved = localStorage.getItem(`code-${slug}`);
		const parsedSaved = saved ? JSON.parse(saved) : {};

		savedCodeMapRef.current = parsedSaved;

		setCodeMap({
			...DEFAULT_CODE,
			...parsedSaved, // cache first
		});
	}, [slug]);

	useEffect(() => {
		const timer = setTimeout(() => {
			const filteredCodeMap = {};

			Object.keys(codeMap).forEach((lang) => {
				const currentCode = codeMap[lang]?.trim();
				const defaultCode = DEFAULT_CODE[lang]?.trim();

				if (currentCode && currentCode !== defaultCode) {
					filteredCodeMap[lang] = codeMap[lang];
				}
			});

			if (Object.keys(filteredCodeMap).length > 0) {
				localStorage.setItem(`code-${slug}`, JSON.stringify(filteredCodeMap));
			} else {
				localStorage.removeItem(`code-${slug}`);
			}

			setSaveLabel("Saved just now");
			setTimeout(() => setSaveLabel("Auto-saved"), 2000);
		}, 800);

		return () => clearTimeout(timer);
	}, [codeMap, slug]);

	useEffect(() => {
		localStorage.setItem("selected-lang", language);
	}, [language]);

	useEffect(() => {
		if (!user || submissionHistory.length === 0) return;

		setCodeMap((prev) => {
			const next = { ...prev };
			let changed = false;

			Object.keys(DEFAULT_CODE).forEach((lang) => {
				// if cache already exists for this language, keep it
				if (savedCodeMapRef.current?.[lang]) return;

				// only fill from latest submission if editor still has default/empty code
				const latestSubmissionForLang = submissionHistory.find(
					(submission) => submission.language === lang,
				);

				if (
					latestSubmissionForLang?.code &&
					(!prev[lang] || prev[lang] === DEFAULT_CODE[lang])
				) {
					next[lang] = latestSubmissionForLang.code;
					changed = true;
				}
			});

			return changed ? next : prev;
		});
	}, [user, submissionHistory]);

	useEffect(() => {
		if (previousUserRef.current && !user) {
			Object.keys(localStorage).forEach((key) => {
				if (key.startsWith("code-")) {
					localStorage.removeItem(key);
				}
			});

			localStorage.removeItem("selected-lang");
			savedCodeMapRef.current = {};
			setCodeMap(DEFAULT_CODE);
			setLanguage("javascript");
		}

		previousUserRef.current = user;
	}, [user]);

	const hintOrder = ["hint1", "hint2", "hint3"];

	const nextHintKey = hintOrder.find((h) => !hints[h]);
	const allHintsDone = !nextHintKey;

	const hintLevelMap = {
		hint1: 1,
		hint2: 2,
		hint3: 3,
	};
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

		setCodeMap((prev) => {
			if (prev[lang]) return prev;

			const latestSubmissionForLang = submissionHistory.find(
				(submission) => submission.language === lang,
			);

			return {
				...prev,
				[lang]:
					latestSubmissionForLang?.code || prev[lang] || DEFAULT_CODE[lang],
			};
		});
	};

	const handleGetHint = () => {
		if (!nextHintKey) return;

		setActiveMainTab("ai");
		setActiveAiTab(nextHintKey);

		getHintAI(
			{
				problemId: problem._id,
				userCode: codeMap[language],
				level: hintLevelMap[nextHintKey],
			},
			{
				onSuccess: (res) => {
					setHints((prev) => ({
						...prev,
						[nextHintKey]: res?.data?.data || "No hint generated",
					}));
				},
			},
		);
	};

	const handleExplain = () => {
		setActiveMainTab("ai");
		setActiveAiTab("explain");

		explainAI(
			{
				code: codeMap[language],
				language,
			},
			{
				onSuccess: (res) => {
					setHints((prev) => ({
						...prev,
						explain: res?.data?.data || "No explanation generated",
					}));
				},
			},
		);
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

					<div className="min-h-0 flex-1 overflow-hidden px-4 pb-4 pt-4">
						<Tabs
							defaultValue="description"
							className="flex h-full min-h-0 flex-col"
						>
							<div className="shrink-0 pb-4">
								<TabsList className="grid w-full grid-cols-2 rounded-2xl bg-slate-100 p-1 dark:bg-zinc-900">
									<TabsTrigger
										value="description"
										className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800"
									>
										Description
									</TabsTrigger>

									<TabsTrigger
										value="submissions"
										className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800"
									>
										Submissions
									</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent
								value="description"
								className="mt-0 min-h-0 flex-1 overflow-hidden"
							>
								<ScrollArea className="h-full pr-2">
									<div className="space-y-6 pb-6">
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
								</ScrollArea>
							</TabsContent>

							<TabsContent
								value="submissions"
								className="mt-0 min-h-0 flex-1 overflow-hidden"
							>
								<ScrollArea className="h-full pr-2">
									<div className="space-y-4 pb-6">
										{!user ? (
											<div className="flex h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
												<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
													<Clock3 className="h-6 w-6" />
												</div>

												<p className="text-base font-semibold text-slate-900 dark:text-white">
													Signin to view submissions
												</p>

												<p className="mt-2 max-w-[260px] text-sm leading-6 text-slate-500 dark:text-zinc-400">
													View your previous submissions, accepted solutions,
													wrong answers, and submission history for this
													problem.
												</p>

												<Button
													onClick={() =>
														navigate(
															`/signin?redirect=${encodeURIComponent(location.pathname)}`,
														)
													}
													className="mt-6 h-11 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-medium text-white"
												>
													Signin
												</Button>
											</div>
										) : isSubmissionLoading ? (
											<div className="flex h-[300px] items-center justify-center">
												<div className="flex flex-col items-center gap-3">
													<div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
													<p className="text-sm text-slate-500 dark:text-zinc-400">
														Loading submissions...
													</p>
												</div>
											</div>
										) : submissionHistory.length === 0 ? (
											<div className="flex h-[300px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
												<Clock3 className="mb-3 h-10 w-10 text-slate-400" />
												<p className="text-sm font-medium text-slate-700 dark:text-zinc-300">
													No submissions yet
												</p>
												<p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
													Your submissions will appear here.
												</p>
											</div>
										) : (
											submissionHistory.map((submission) => {
												const isAccepted = submission.status === "Accepted";
												const isWrong = submission.status === "Wrong Answer";
												const isRuntime = submission.status === "Runtime Error";

												return (
													<div
														key={submission._id}
														className="rounded-[24px] border border-slate-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"
													>
														<div className="flex items-start justify-between gap-3">
															<div className="flex items-center gap-3">
																<div
																	className={cn(
																		"flex h-10 w-10 items-center justify-center rounded-2xl",
																		isAccepted
																			? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-300"
																			: isWrong
																				? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-300"
																				: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
																	)}
																>
																	{isAccepted ? (
																		<CheckCircle2 className="h-5 w-5" />
																	) : isWrong ? (
																		<XCircle className="h-5 w-5" />
																	) : (
																		<AlertTriangle className="h-5 w-5" />
																	)}
																</div>

																<div>
																	<p className="text-sm font-semibold text-slate-900 dark:text-white">
																		{submission.status}
																	</p>

																	<p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
																		{submission.language?.toUpperCase()} •{" "}
																		{new Date(
																			submission.createdAt,
																		).toLocaleString()}
																	</p>
																</div>
															</div>

															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	setSelectedSubmission(submission)
																}
																className="rounded-xl border-slate-200 bg-white text-xs font-medium dark:border-zinc-700 dark:bg-zinc-900"
															>
																View Code
															</Button>
														</div>
													</div>
												);
											})
										)}
									</div>
								</ScrollArea>
							</TabsContent>
						</Tabs>
					</div>
				</div>

				<div className="flex h-full min-h-0 flex-col overflow-hidden">
					<div className="min-h-0 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-zinc-700">
						<div className="flex min-h-full flex-col gap-5">
							<div className="relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-white/90 via-white/75 to-white/50 backdrop-blur-2xl dark:border-zinc-800 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-950/20">
								<div className="relative flex flex-wrap items-center gap-3 border-b border-slate-100 p-5 dark:border-zinc-800">
									<Select value={language} onValueChange={handleLanguageChange}>
										<SelectTrigger className="!h-12 w-[190px] rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium shadow-none dark:border-zinc-700 dark:bg-zinc-900">
											<SelectValue>{LANGUAGES[language]}</SelectValue>
										</SelectTrigger>

										<SelectContent
											sideOffset={6}
											align="center"
											className="w-[190px] rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-900"
										>
											{Object.entries(LANGUAGES).map(([value, label]) => (
												<SelectItem
													key={value}
													value={value}
													className="rounded-xl px-3 py-2"
												>
													{label}
												</SelectItem>
											))}
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

										<Button
											variant="outline"
											onClick={handleGetHint}
											disabled={isGettingHint || allHintsDone}
											className="h-12 rounded-2xl border-amber-200 bg-amber-50 px-5 text-sm font-medium text-amber-600 hover:bg-amber-100"
										>
											{isGettingHint
												? "Thinking..."
												: allHintsDone
													? "All Hints Used"
													: nextHintKey === "hint1"
														? "Hint 1 💡"
														: nextHintKey === "hint2"
															? "Hint 2 💡"
															: "Hint 3 💡"}
										</Button>

										<Button
											variant="outline"
											onClick={handleExplain}
											disabled={isExplaining}
											className="h-12 rounded-2xl border-blue-200 bg-blue-50 px-5 text-sm font-medium text-blue-600 hover:bg-blue-100"
										>
											{isExplaining ? "Explaining..." : "Explain 🤖"}
										</Button>
									</div>
								</div>

								<div className="p-5">
									<div className="overflow-hidden rounded-[28px] border border-slate-200 bg-black shadow-inner dark:border-zinc-700">
										<Editor
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

							<Tabs
								value={activeMainTab}
								onValueChange={setActiveMainTab}
								className="mt-6"
							>
								<div className="overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-white via-indigo-50/30 to-white shadow-[0_16px_50px_rgba(15,23,42,0.06)] dark:border-zinc-800 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-950">
									{/* Header Tabs */}
									<div className="border-b border-slate-200/70 bg-white/60 px-3 pt-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/50">
										<TabsList className="flex w-full items-stretch gap-2 bg-transparent p-0">
											<TabsTrigger
												value="io"
												className="group relative flex flex-1 items-center justify-center gap-2 rounded-t-2xl border border-transparent border-b-0 bg-transparent px-4 py-3 text-[13px] font-medium text-slate-500 transition-all data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-[0_-1px_0_rgba(255,255,255,0.7),0_8px_24px_rgba(15,23,42,0.06)] dark:data-[state=active]:border-zinc-700 dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-indigo-300"
											>
												<span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[12px] transition group-data-[state=active]:bg-indigo-100 dark:bg-zinc-800 dark:group-data-[state=active]:bg-indigo-500/20">
													⌨
												</span>
												<span>Input & Output</span>
											</TabsTrigger>

											<TabsTrigger
												value="ai"
												className="group relative flex flex-1 items-center justify-center gap-2 rounded-t-2xl border border-transparent border-b-0 bg-transparent px-4 py-3 text-[13px] font-medium text-slate-500 transition-all data-[state=active]:border-slate-200 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-[0_-1px_0_rgba(255,255,255,0.7),0_8px_24px_rgba(15,23,42,0.06)] dark:data-[state=active]:border-zinc-700 dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-indigo-300"
											>
												<span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[12px] transition group-data-[state=active]:bg-indigo-100 dark:bg-zinc-800 dark:group-data-[state=active]:bg-indigo-500/20">
													✦
												</span>
												<span>AI Assistant</span>
											</TabsTrigger>
										</TabsList>
									</div>

									{/* Body */}
									<div className="p-4 sm:p-5">
										<TabsContent value="io" className="mt-0">
											<div className="grid gap-4 xl:grid-cols-2">
												{/* Input */}
												<div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70">
													<div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-zinc-800 sm:px-5">
														<div>
															<p className="text-sm font-semibold text-slate-900 dark:text-white">
																Custom Input
															</p>
															<p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
																Enter stdin for your program
															</p>
														</div>
													</div>

													<div className="p-0">
														<Textarea
															value={input}
															onChange={(e) => setInput(e.target.value)}
															placeholder="Enter your custom input here..."
															className="h-[220px] resize-none rounded-none border-0 bg-transparent px-4 py-4 font-mono text-xs leading-6 shadow-none outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:px-5"
														/>
													</div>
												</div>

												{/* Output */}
												<div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/70">
													<div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-zinc-800 sm:px-5">
														<div>
															<p className="text-sm font-semibold text-slate-900 dark:text-white">
																Output
															</p>
															<p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
																Program output and run status
															</p>
														</div>

														{runStatus && (
															<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
																{runStatus}
															</span>
														)}
													</div>

													<div
														className={cn(
															"h-[220px] overflow-y-auto bg-slate-50/80 px-4 py-4 font-mono text-xs leading-6 whitespace-pre-wrap dark:bg-zinc-950 sm:px-5",
															outputColor,
														)}
													>
														{output || "Run your code to see output here"}
													</div>
												</div>
											</div>
										</TabsContent>
										<TabsContent value="ai" className="mt-0">
											{!user ? (
												<div className="flex h-[320px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
													<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
														✨
													</div>

													<p className="text-base font-semibold text-slate-900 dark:text-white">
														Signin to use AI Assistant
													</p>

													<p className="mt-2 max-w-[260px] text-sm leading-6 text-slate-500 dark:text-zinc-400">
														Get step-by-step hints, explanations, and AI-powered
														guidance for solving this problem.
													</p>

													<Button
														onClick={() =>
															navigate(
																`/signin?redirect=${encodeURIComponent(location.pathname)}`,
															)
														}
														className="mt-6 h-11 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-medium text-white"
													>
														Signin
													</Button>
												</div>
											) : (
												<div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-br from-white via-violet-50/20 to-white shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-950">
													<div className="flex flex-col gap-4 border-b border-slate-200/70 px-4 py-4 dark:border-zinc-800 sm:px-5 sm:py-5 md:flex-row md:items-center md:justify-between">
														<div className="flex items-center gap-3">
															<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/20">
																✦
															</div>

															<div>
																<p className="text-sm font-semibold text-slate-900 dark:text-white">
																	AI Assistant
																</p>
																<p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
																	Personalized hints & explanations
																</p>
															</div>
														</div>

														<div className="flex flex-wrap gap-2">
															{activeAiTab !== "explain" && (
																<Button
																	size="sm"
																	onClick={handleGetHint}
																	disabled={isGettingHint || !!hints.hint3}
																	className="h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 text-xs font-medium text-white shadow-sm shadow-indigo-500/20 hover:opacity-95 flex items-center gap-2"
																>
																	{isGettingHint ? (
																		<>
																			<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
																			Thinking...
																		</>
																	) : hints.hint1 ? (
																		hints.hint2 ? (
																			hints.hint3 ? (
																				"All Hints Done"
																			) : (
																				"Get Hint 3"
																			)
																		) : (
																			"Get Hint 2"
																		)
																	) : (
																		"Get Hint 1"
																	)}
																</Button>
															)}

															{/* SHOW EXPLAIN BUTTON ONLY IF USER IS IN EXPLAIN TAB */}
															{activeAiTab === "explain" && (
																<Button
																	size="sm"
																	variant="outline"
																	onClick={handleExplain}
																	disabled={isExplaining}
																	className="h-9 rounded-xl border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 flex items-center gap-2"
																>
																	{isExplaining ? (
																		<>
																			<span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400/40 border-t-slate-700 dark:border-zinc-500/40 dark:border-t-white" />
																			Thinking...
																		</>
																	) : hints.explain ? (
																		"Re-Explain"
																	) : (
																		"Explain"
																	)}
																</Button>
															)}
														</div>
													</div>

													<Tabs
														value={activeAiTab}
														onValueChange={setActiveAiTab}
													>
														<div className="px-4 pt-4 sm:px-5">
															<TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
																{[
																	{ key: "hint1", num: 1, unlocked: true },
																	{
																		key: "hint2",
																		num: 2,
																		unlocked: !!hints.hint1,
																	},
																	{
																		key: "hint3",
																		num: 3,
																		unlocked: !!hints.hint2,
																	},
																	{
																		key: "explain",
																		label: "Explain",
																		unlocked: true,
																	},
																].map((tab) => (
																	<TabsTrigger
																		key={tab.key}
																		value={tab.key}
																		disabled={!tab.unlocked}
																		className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-500 shadow-sm transition-all data-[state=active]:border-indigo-200 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:data-[state=active]:border-indigo-500/30 dark:data-[state=active]:bg-indigo-500"
																	>
																		{tab.num ? (
																			<span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 transition group-data-[state=active]:bg-white group-data-[state=active]:text-indigo-600 dark:bg-zinc-800 dark:text-zinc-300 dark:group-data-[state=active]:bg-white dark:group-data-[state=active]:text-indigo-600">
																				{tab.num}
																			</span>
																		) : null}
																		{tab.label || `Hint ${tab.num}`}
																	</TabsTrigger>
																))}
															</TabsList>
														</div>

														<div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
															{["hint1", "hint2", "hint3", "explain"].map(
																(key) => (
																	<TabsContent
																		key={key}
																		value={key}
																		className="mt-0"
																	>
																		{!hints[key] ? (
																			<div className="flex min-h-[160px] items-center justify-center rounded-[22px] border border-dashed border-slate-200 bg-white/70 px-6 py-10 text-center text-sm text-slate-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
																				<div>
																					<p className="font-medium text-slate-700 dark:text-zinc-200">
																						{key === "explain"
																							? "Click Explain to analyze your code"
																							: "Unlock hints step by step"}
																					</p>
																					<p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
																						Each hint becomes available only
																						after the previous one is used.
																					</p>
																				</div>
																			</div>
																		) : (
																			<div className="space-y-3">
																				<AIContent content={hints[key]} />

																				{key !== "explain" && (
																					<div className="flex flex-wrap gap-2">
																						{["Hint 1", "Hint 2", "Hint 3"].map(
																							(label, i) => {
																								const unlocked =
																									i === 0
																										? !!hints.hint1
																										: i === 1
																											? !!hints.hint2
																											: !!hints.hint3;

																								return (
																									<span
																										key={label}
																										className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
																											unlocked
																												? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
																												: "border-slate-200 bg-slate-50 text-slate-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
																										}`}
																									>
																										{label}{" "}
																										{unlocked ? "✓" : "🔒"}
																									</span>
																								);
																							},
																						)}
																					</div>
																				)}
																			</div>
																		)}
																	</TabsContent>
																),
															)}
														</div>
													</Tabs>
												</div>
											)}
										</TabsContent>
									</div>
								</div>
							</Tabs>
						</div>
					</div>
				</div>
			</div>
			<Dialog
				open={!!selectedSubmission}
				onOpenChange={(open) => {
					if (!open) setSelectedSubmission(null);
				}}
			>
				<DialogContent className="!max-w-[90vw] w-[90vw] h-[88vh] flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white p-0 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
					<div className="shrink-0 border-b border-slate-100 px-6 py-5 dark:border-zinc-800">
						<div className="flex items-center gap-4 pr-8">
							<div
								className={cn(
									"flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl",
									selectedSubmission?.status === "Accepted"
										? "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-300"
										: selectedSubmission?.status === "Wrong Answer"
											? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-300"
											: "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
								)}
							>
								{selectedSubmission?.status === "Accepted" ? (
									<CheckCircle2 className="h-7 w-7" />
								) : selectedSubmission?.status === "Wrong Answer" ? (
									<XCircle className="h-7 w-7" />
								) : (
									<AlertTriangle className="h-7 w-7" />
								)}
							</div>

							<div>
								<DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
									Submission Code
								</DialogTitle>
								<div className="mt-3 flex flex-wrap items-center gap-2">
									<Badge
										className={cn(
											"rounded-full border px-3 py-1 text-[11px]",
											selectedSubmission?.status === "Accepted"
												? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300"
												: selectedSubmission?.status === "Wrong Answer"
													? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
													: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
										)}
									>
										{selectedSubmission?.status}
									</Badge>
									<div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
										{selectedSubmission?.language?.toUpperCase()}
									</div>
									<div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
										{new Date(selectedSubmission?.createdAt).toLocaleString()}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Editor */}
					<div className="min-h-0 flex-1 p-5">
						<div className="h-full overflow-hidden rounded-[24px] border border-zinc-700 bg-[#0d1117]">
							<Editor
								height="100%"
								language={
									MONACO_LANG[selectedSubmission?.language] || "javascript"
								}
								value={selectedSubmission?.code || ""}
								theme="vs-dark"
								options={{
									readOnly: true,
									fontSize: 15,
									lineHeight: 26,
									minimap: { enabled: false },
									scrollBeyondLastLine: false,
									padding: { top: 20, bottom: 20 },
									fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
									fontLigatures: true,
									tabSize: 4,
									renderLineHighlight: "line",
									smoothScrolling: true,
									automaticLayout: true,
									scrollbar: {
										verticalScrollbarSize: 10,
										horizontalScrollbarSize: 10,
										useShadows: false,
									},
									overviewRulerBorder: false,
									hideCursorInOverviewRuler: true,
								}}
							/>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
