import { useParams } from "react-router-dom";
import { useProblemBySlug } from "@/hooks/useProblems";
import { useState, useEffect } from "react";
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
	const { data: problem, isLoading } = useProblemBySlug(slug);

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

		setTimeout(() => {
			setOutput(`[Input]
${input || "[2,7,11,15]\n9"}

[Output]
[0,1]`);
			setOutputColor("text-green-600");
			setRunStatus("Passed in 2ms");
		}, 600);
	};

	const handleSubmit = () => {
		setRunStatus("Judging...");
		setOutput("Running test cases...");
		setOutputColor("text-muted-foreground");
		setTimeout(() => {
			setOutput(
				"✓ 57/57 test cases passed\nRuntime: 72ms — beats 94.3%\nMemory: 42.8MB — beats 71.2%",
			);
			setOutputColor("text-green-600");
			setRunStatus("Accepted");
		}, 1200);
	};

	const handleLanguageChange = (lang) => {
		setLanguage(lang);

		setCodeMap((prev) => ({
			...prev,
			[lang]: prev[lang] || DEFAULT_CODE[lang],
		}));
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
		<div className="h-[100vh] flex flex-col">
			<div className="h-11 flex items-center gap-3 px-4 border-b bg-background flex-shrink-0">
				<button
					onClick={() => navigate("/problems")}
					className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-2 py-1 rounded-md transition-colors"
				>
					<ChevronLeft className="w-3.5 h-3.5" />
					Problems
				</button>
				<div className="w-px h-4 bg-border" />
				<span className="text-xs text-muted-foreground">
					#{problem.id ?? "42"}
				</span>
				<span className="text-sm font-medium">{problem.title}</span>
				<Badge
					className={cn(
						"text-xs border rounded-full px-2 py-0.5",
						DIFFICULTY_STYLES[problem.difficulty],
					)}
				>
					{problem.difficulty}
				</Badge>

				{/* <div className="ml-auto flex items-center gap-3">
					{problem.solved && (
						<>
							<div className="flex items-center gap-1.5 text-green-600">
								<CheckCircle2 className="w-3.5 h-3.5" />
								<span className="text-xs">Solved</span>
							</div>
							<div className="w-px h-4 bg-border" />
						</>
					)}
					<div className="flex flex-col gap-0.5">
						<span className="text-[11px] text-muted-foreground">
							73.2% acceptance
						</span>
						<div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
							<div
								className="h-full bg-green-500 rounded-full"
								style={{ width: "73.2%" }}
							/>
						</div>
					</div>
				</div> */}
			</div>

			<div className="flex flex-1 overflow-hidden">
				<div className="w-[44%] border-r flex flex-col bg-background">
					<div className="px-4 py-3 border-b flex-shrink-0">
						<div className="flex gap-1.5 flex-wrap">
							{problem.tags?.map((tag) => (
								<span
									key={tag}
									className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border"
								>
									{tag}
								</span>
							))}
						</div>
						{/* <div className="mt-3 grid grid-cols-3 divide-x border rounded-lg overflow-hidden">
							{[
								{ val: "12.4M", label: "Submissions", color: "text-green-700" },
								{ val: "73.2%", label: "Acceptance", color: "text-green-700" },
								{ val: "O(n)", label: "Optimal", color: "" },
							].map(({ val, label, color }) => (
								<div key={label} className="px-3 py-2 flex flex-col gap-0.5">
									<span className={cn("text-sm font-medium", color)}>
										{val}
									</span>
									<span className="text-[11px] text-muted-foreground">
										{label}
									</span>
								</div>
							))}
						</div> */}
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-border">
						<div>
							<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
								Description
							</p>
							<p className="text-[13.5px] leading-relaxed text-muted-foreground">
								{problem.description}
							</p>
						</div>

						{problem.examples?.length > 0 && (
							<div>
								<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
									Examples
								</p>
								<div className="space-y-2.5">
									{problem.examples.map((ex, i) => (
										<div key={i} className="border rounded-xl overflow-hidden">
											<div className="px-3.5 py-2 bg-muted text-[11px] font-medium text-muted-foreground border-b">
												Example {i + 1}
											</div>
											<div className="grid grid-cols-2 divide-x">
												<div className="p-3.5">
													<p className="text-[11px] text-muted-foreground mb-1.5 font-medium">
														Input
													</p>
													<pre className="font-mono text-[12.5px] text-foreground leading-relaxed">
														{ex.input}
													</pre>
												</div>
												<div className="p-3.5">
													<p className="text-[11px] text-muted-foreground mb-1.5 font-medium">
														Output
													</p>
													<pre className="font-mono text-[12.5px] text-foreground leading-relaxed">
														{ex.output}
													</pre>
													{ex.explanation && (
														<p className="text-[11px] text-muted-foreground mt-2 italic leading-relaxed">
															{ex.explanation}
														</p>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{constraints.length > 0 && (
							<div>
								<p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
									Constraints
								</p>
								<div className="border rounded-lg divide-y">
									{constraints.map((c, i) => (
										<div
											key={i}
											className="flex items-center gap-2.5 px-3.5 py-2"
										>
											<div className="w-1 h-1 rounded-full bg-border flex-shrink-0" />
											<code className="font-mono text-[12.5px] text-muted-foreground">
												{c}
											</code>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>

				{/* RIGHT — editor */}
				<div className="flex-1 flex flex-col">
					<div className="h-10 flex items-center gap-2 px-3 border-b bg-background flex-shrink-0">
						<Select value={language} onValueChange={handleLanguageChange}>
							<SelectTrigger className="h-7 w-32 text-xs font-mono border-border">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="javascript">JavaScript</SelectItem>
								<SelectItem value="python">Python</SelectItem>
								<SelectItem value="java">Java</SelectItem>
								<SelectItem value="cpp">C++</SelectItem>
							</SelectContent>
						</Select>

						<div className="ml-auto flex items-center gap-2">
							<span className="text-[11px] text-muted-foreground">
								{saveLabel}
							</span>
							<Button
								variant="ghost"
								size="sm"
								className="h-7 text-xs px-2"
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
								size="sm"
								className="h-7 text-xs px-3"
								onClick={handleRun}
							>
								Run
							</Button>
							<Button
								size="sm"
								className="h-7 text-xs px-3 bg-green-600 hover:bg-green-700 text-white border-0"
								onClick={handleSubmit}
							>
								Submit
							</Button>
						</div>
					</div>

					<div className="flex-1 overflow-hidden">
						<Editor
							height="100%"
							language={MONACO_LANG[language]}
							value={codeMap[language]}
							onChange={handleCodeChange}
							theme="vs-dark"
							options={{
								fontSize: 13,
								lineHeight: 22,
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
								hideCursorInOverviewRuler: true,
							}}
						/>
					</div>

					<div className="border-t bg-background flex-shrink-0">
						<div className="flex items-center border-b px-3">
							<div className="py-2 text-xs font-medium border-b-2 border-foreground text-foreground px-1">
								Console
							</div>
							{runStatus && (
								<span
									className={cn(
										"ml-auto text-[11px] font-medium",
										runStatus === "Accepted" || runStatus.startsWith("Passed")
											? "text-green-600"
											: "text-muted-foreground",
									)}
								>
									{runStatus}
								</span>
							)}
						</div>
						<div className="grid grid-cols-2 divide-x h-[120px]">
							<div className="p-3 flex flex-col gap-1.5">
								<p className="text-[11px] font-medium text-muted-foreground">
									Custom input
								</p>
								<textarea
									value={input}
									onChange={(e) => setInput(e.target.value)}
									className="flex-1 border rounded-md p-2 font-mono text-xs bg-muted resize-none outline-none focus:border-border/60"
									placeholder={`[2,7,11,15]\n9`}
								/>
							</div>
							<div className="p-3 flex flex-col gap-1.5">
								<p className="text-[11px] font-medium text-muted-foreground">
									Output
								</p>
								<div
									className={cn(
										"flex-1 border rounded-md p-2 font-mono text-xs bg-muted overflow-y-auto whitespace-pre",
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
	);
}
