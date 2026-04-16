import { runProblem, submitProblem } from "@/api/consoleApi";
import { useMutation } from "@tanstack/react-query";

export const useRunProblem = () => {
	return useMutation({
		mutationFn: runProblem,
	});
};

export const useSubmitProblem = () => {
	return useMutation({
		mutationFn: submitProblem,
	});
};
