// src/pages/CreateProblem.jsx
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateProblem } from "@/hooks/useProblems";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProblemPage() {
	const navigate = useNavigate();
	const { mutate: createProblem, isPending } = useCreateProblem();

	const { register, handleSubmit, control } = useForm({
		defaultValues: {
			title: "",
			description: "",
			difficulty: "easy",
			tags: "",
			constraints: "",
			examples: [],
			testCases: [],
		},
	});

	// dynamic fields
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

	const generateSlug = (title) => title.toLowerCase().replace(/ /g, "-");

	const onSubmit = (data) => {
		const payload = {
			...data,
			slug: generateSlug(data.title),
			tags: data.tags.split(",").map((t) => t.trim()),
		};

		createProblem(payload, {
			onSuccess: () => {
				navigate(`/problem/${payload.slug}`);
			},
		});
	};

	return (
		<div className="max-w-5xl mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold">Create Problem</h1>

			<form
				onSubmit={handleSubmit(onSubmit)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
						e.preventDefault();
					}
				}}
				className="space-y-8"
			>
				{/* BASIC INFO */}
				<div className="space-y-4">
					<h2 className="text-lg font-semibold">Basic Info</h2>

					<Input placeholder="Title" {...register("title")} />

					<Textarea placeholder="Description" {...register("description")} />

					<select
						className="border p-2 rounded w-full"
						{...register("difficulty")}
					>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>

					<Input placeholder="Tags (comma separated)" {...register("tags")} />

					<Textarea placeholder="Constraints" {...register("constraints")} />
				</div>

				{/* EXAMPLES */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-semibold">Examples</h2>
						<Button
							type="button"
							variant="outline"
							onClick={() =>
								addExample({
									input: "",
									output: "",
									explanation: "",
								})
							}
						>
							Add Example
						</Button>
					</div>

					{exampleFields.map((field, index) => (
						<div key={field.id} className="border p-4 rounded space-y-2">
							<Input
								placeholder="Input"
								{...register(`examples.${index}.input`)}
							/>

							<Input
								placeholder="Output"
								{...register(`examples.${index}.output`)}
							/>

							<Input
								placeholder="Explanation"
								{...register(`examples.${index}.explanation`)}
							/>

							<Button
								type="button"
								variant="destructive"
								onClick={() => removeExample(index)}
							>
								Delete
							</Button>
						</div>
					))}
				</div>

				{/* TEST CASES */}
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-semibold">Test Cases</h2>
						<Button
							type="button"
							variant="outline"
							onClick={() =>
								addTestCase({
									input: "",
									output: "",
								})
							}
						>
							Add Test Case
						</Button>
					</div>

					{testCaseFields.map((field, index) => (
						<div key={field.id} className="border p-4 rounded space-y-2">
							<Input
								placeholder="Input"
								{...register(`testCases.${index}.input`)}
							/>

							<Input
								placeholder="Output"
								{...register(`testCases.${index}.output`)}
							/>

							<Button
								type="button"
								variant="destructive"
								onClick={() => removeTestCase(index)}
							>
								Delete
							</Button>
						</div>
					))}
				</div>

				{/* SUBMIT */}
				<Button type="submit" disabled={isPending}>
					{isPending ? "Creating..." : "Create Problem"}
				</Button>
			</form>
		</div>
	);
}
