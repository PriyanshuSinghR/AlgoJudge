// ProblemForm.jsx
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, FileText, Lightbulb, ShieldCheck } from "lucide-react";

export default function ProblemForm({ defaultValues, onSubmit, isSubmitting }) {
	const { register, handleSubmit, control, setValue, watch } = useForm({
		defaultValues,
	});

	const difficulty = watch("difficulty");

	const {
		fields: exampleFields,
		append: addExample,
		remove: removeExample,
	} = useFieldArray({
		control,
		name: "examples",
	});

	const {
		fields: testCaseFields,
		append: addTestCase,
		remove: removeTestCase,
	} = useFieldArray({
		control,
		name: "testCases",
	});

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			onKeyDown={(e) => {
				if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
					e.preventDefault();
				}
			}}
			className="space-y-6"
		>
			<div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
				<div className="border-b border-slate-100 px-6 py-5 dark:border-zinc-800">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
							<FileText className="h-5 w-5" />
						</div>

						<div>
							<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
								Basic Information
							</h2>
							<p className="text-sm text-slate-500 dark:text-zinc-400">
								Add title, description, difficulty and tags
							</p>
						</div>
					</div>
				</div>

				<div className="grid gap-5 p-6">
					<Input
						placeholder="Problem Title"
						className="h-12 rounded-2xl border-slate-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-950"
						{...register("title")}
					/>

					<Textarea
						placeholder="Write problem description..."
						className="min-h-[140px] rounded-2xl border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
						{...register("description")}
					/>

					<div className="grid gap-5 lg:grid-cols-2">
						<Select
							value={difficulty}
							onValueChange={(value) => setValue("difficulty", value)}
						>
							<SelectTrigger className="!h-12 rounded-2xl border border-slate-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-950">
								<SelectValue placeholder="Select Difficulty" />
							</SelectTrigger>

							<SelectContent className="rounded-2xl border border-slate-200 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-900">
								<SelectItem className="rounded-xl px-3 py-2" value="easy">
									Easy
								</SelectItem>
								<SelectItem className="rounded-xl px-3 py-2" value="medium">
									Medium
								</SelectItem>
								<SelectItem className="rounded-xl px-3 py-2" value="hard">
									Hard
								</SelectItem>
							</SelectContent>
						</Select>

						<Input
							placeholder="Tags (comma separated)"
							className="h-12 rounded-2xl border-slate-200 bg-white px-4 dark:border-zinc-700 dark:bg-zinc-950"
							{...register("tags")}
						/>
					</div>

					<Textarea
						placeholder="Constraints"
						className="min-h-[120px] rounded-2xl border-slate-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
						{...register("constraints")}
					/>
				</div>
			</div>

			<div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-zinc-800">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
							<Lightbulb className="h-5 w-5" />
						</div>

						<div>
							<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
								Examples
							</h2>
							<p className="text-sm text-slate-500 dark:text-zinc-400">
								Add sample inputs and outputs
							</p>
						</div>
					</div>

					<Button
						type="button"
						onClick={() =>
							addExample({ input: "", output: "", explanation: "" })
						}
						className="rounded-2xl bg-indigo-600 hover:bg-indigo-700"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Example
					</Button>
				</div>

				<div className="space-y-4 p-6">
					{exampleFields.map((field, index) => (
						<div
							key={field.id}
							className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-zinc-700 dark:bg-zinc-950/60"
						>
							<div className="mb-4 flex items-center justify-between">
								<p className="font-medium text-slate-900 dark:text-white">
									Example {index + 1}
								</p>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
									onClick={() => removeExample(index)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>

							<div className="space-y-3">
								<Input
									{...register(`examples.${index}.input`)}
									placeholder="Input"
									className="h-12 rounded-2xl border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
								/>

								<Input
									{...register(`examples.${index}.output`)}
									placeholder="Output"
									className="h-12 rounded-2xl border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
								/>

								<Textarea
									{...register(`examples.${index}.explanation`)}
									placeholder="Explanation"
									className="min-h-[100px] rounded-2xl border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_10px_30px_rgba(99,102,241,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-zinc-800">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
							<ShieldCheck className="h-5 w-5" />
						</div>

						<div>
							<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
								Test Cases
							</h2>
							<p className="text-sm text-slate-500 dark:text-zinc-400">
								Add hidden test cases for judging
							</p>
						</div>
					</div>

					<Button
						type="button"
						onClick={() => addTestCase({ input: "", output: "" })}
						className="rounded-2xl bg-indigo-600 hover:bg-indigo-700"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Test Case
					</Button>
				</div>

				<div className="space-y-4 p-6">
					{testCaseFields.map((field, index) => (
						<div
							key={field.id}
							className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-zinc-700 dark:bg-zinc-950/60"
						>
							<div className="mb-4 flex items-center justify-between">
								<p className="font-medium text-slate-900 dark:text-white">
									Test Case {index + 1}
								</p>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
									onClick={() => removeTestCase(index)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>

							<div className="space-y-3">
								<Input
									{...register(`testCases.${index}.input`)}
									placeholder="Input"
									className="h-12 rounded-2xl border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
								/>

								<Input
									{...register(`testCases.${index}.output`)}
									placeholder="Expected Output"
									className="h-12 rounded-2xl border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex justify-end">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-8 text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
				>
					{isSubmitting ? "Saving..." : "Create Problem"}
				</Button>
			</div>
		</form>
	);
}
