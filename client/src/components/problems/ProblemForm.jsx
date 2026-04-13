import { useForm, useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProblemForm({ defaultValues, onSubmit, isSubmitting }) {
	const { register, handleSubmit, control } = useForm({
		defaultValues,
	});

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
			className="space-y-8"
		>
			{/* BASIC */}
			<div className="space-y-4">
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
			<div>
				<div className="flex justify-between mb-2">
					<h2 className="font-semibold">Examples</h2>
					<Button
						type="button"
						onClick={() =>
							addExample({ input: "", output: "", explanation: "" })
						}
					>
						Add
					</Button>
				</div>

				{exampleFields.map((field, index) => (
					<div key={field.id} className="border p-3 mb-2 space-y-2">
						<Input
							{...register(`examples.${index}.input`)}
							placeholder="Input"
						/>
						<Input
							{...register(`examples.${index}.output`)}
							placeholder="Output"
						/>
						<Input
							{...register(`examples.${index}.explanation`)}
							placeholder="Explanation"
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
			<div>
				<div className="flex justify-between mb-2">
					<h2 className="font-semibold">Test Cases</h2>
					<Button
						type="button"
						onClick={() => addTestCase({ input: "", output: "" })}
					>
						Add
					</Button>
				</div>

				{testCaseFields.map((field, index) => (
					<div key={field.id} className="border p-3 mb-2 space-y-2">
						<Input
							{...register(`testCases.${index}.input`)}
							placeholder="Input"
						/>
						<Input
							{...register(`testCases.${index}.output`)}
							placeholder="Output"
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

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Saving..." : "Submit"}
			</Button>
		</form>
	);
}
