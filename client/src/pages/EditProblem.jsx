import { useParams, useNavigate } from "react-router-dom";
import { useProblemById, useUpdateProblem } from "@/hooks/useProblems";

import ProblemForm from "@/components/problems/ProblemForm";

export default function EditProblemPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { data: problem, isLoading } = useProblemById(id);
	const { mutate: updateProblem, isPending } = useUpdateProblem();

	if (isLoading) return <div>Loading...</div>;

	const handleSubmit = (data) => {
		const payload = {
			...data,
			tags: data.tags.split(",").map((t) => t.trim()),
		};

		updateProblem(
			{ id, payload },
			{
				onSuccess: () => navigate(`/problems`),
			},
		);
	};

	return (
		<div className="max-w-5xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Edit Problem</h1>

			<ProblemForm
				defaultValues={{
					...problem,
					tags: problem.tags.join(", "),
				}}
				onSubmit={handleSubmit}
				isSubmitting={isPending}
			/>
		</div>
	);
}
