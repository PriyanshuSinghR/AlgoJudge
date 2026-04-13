import ProblemForm from "@/components/problems/ProblemForm";
import { useCreateProblem } from "@/hooks/useProblems";
import { useNavigate } from "react-router-dom";

export default function CreateProblemPage() {
	const { mutate: createProblem, isPending } = useCreateProblem();
	const navigate = useNavigate();

	const handleSubmit = (data) => {
		const payload = {
			...data,
			slug: data.title.toLowerCase().replace(/ /g, "-"),
			tags: data.tags.split(",").map((t) => t.trim()),
		};

		createProblem(payload, {
			onSuccess: () => navigate(`/problem/${payload.slug}`),
		});
	};

	return (
		<div className="max-w-5xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Create Problem</h1>

			<ProblemForm
				defaultValues={{
					title: "",
					description: "",
					difficulty: "easy",
					tags: "",
					constraints: "",
					examples: [],
					testCases: [],
				}}
				onSubmit={handleSubmit}
				isSubmitting={isPending}
			/>
		</div>
	);
}
