import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy } from "lucide-react";
import { useState } from "react";

const AIContent = ({ content }) => {
	const [copied, setCopied] = useState(false);

	const copyCode = (text) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="relative group">
			<div className="relative rounded-[28px] border border-white/40 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl p-6 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
				<div className="space-y-5">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							h2: ({ children }) => (
								<div className="mt-6">
									<h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
										<span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
										{children}
									</h2>
									<div className="mt-2 h-[1px] bg-gradient-to-r from-indigo-200 via-transparent to-transparent dark:from-indigo-500/20" />
								</div>
							),

							h3: ({ children }) => (
								<h3 className="mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
									{children}
								</h3>
							),

							p: ({ children }) => (
								<p className="text-sm leading-7 text-slate-600 dark:text-zinc-300">
									{children}
								</p>
							),

							code({ inline, children }) {
								if (inline) {
									return (
										<code className="px-1.5 py-0.5 rounded-md bg-slate-100 text-indigo-600 text-xs font-mono dark:bg-zinc-800 dark:text-indigo-300">
											{children}
										</code>
									);
								}

								return (
									<div className="relative group/code">
										<button
											onClick={() => copyCode(children)}
											className="absolute top-2 right-2 text-xs px-2 py-1 rounded-md bg-zinc-800 text-white opacity-0 group-hover/code:opacity-100 transition"
										>
											{copied ? "Copied" : <Copy className="h-3 w-3" />}
										</button>

										<pre className="overflow-x-auto rounded-xl bg-[#0d1117] p-4 text-xs text-zinc-200 shadow-inner border border-zinc-800">
											<code>{children}</code>
										</pre>
									</div>
								);
							},

							blockquote: ({ children }) => (
								<div className="flex gap-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/60 dark:bg-indigo-500/5 px-4 py-3">
									<div className="w-1 rounded-full bg-indigo-500" />
									<p className="text-sm text-slate-700 dark:text-zinc-300 leading-6">
										{children}
									</p>
								</div>
							),

							table: ({ children }) => (
								<div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-700">
									<table className="w-full text-sm">{children}</table>
								</div>
							),

							th: ({ children }) => (
								<th className="bg-slate-100 dark:bg-zinc-800 px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-zinc-300">
									{children}
								</th>
							),

							td: ({ children }) => (
								<td className="px-4 py-2 border-t text-slate-600 dark:text-zinc-300">
									{children}
								</td>
							),

							ul: ({ children }) => (
								<ul className="space-y-2 pl-5 list-disc text-sm text-slate-600 dark:text-zinc-300">
									{children}
								</ul>
							),

							li: ({ children }) => <li className="leading-6">{children}</li>,
						}}
					>
						{content}
					</ReactMarkdown>
				</div>
			</div>
		</div>
	);
};

export default AIContent;
