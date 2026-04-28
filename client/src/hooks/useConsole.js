import {
	getSubmissionHistory,
	runProblem,
	submitProblem,
} from "@/api/consoleApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRunProblem = () => {
	return useMutation({
		mutationFn: runProblem,
	});
};

export const useSubmitProblem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: submitProblem,
		onSuccess: () => {
			queryClient.invalidateQueries(["submissionHistory"]);
		},
	});
};

export const useSubmissionHistory = (problemId, user) => {
	return useQuery({
		queryKey: ["submissionHistory", problemId],
		queryFn: async () => {
			const res = await getSubmissionHistory(problemId);
			return res.data.data;
		},
		enabled: !!problemId && !!user,
	});
};
