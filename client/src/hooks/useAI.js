import { useMutation } from "@tanstack/react-query";
import { getHint, explainCode } from "@/api/aiApi";

export const useHint = () => {
	return useMutation({
		mutationFn: getHint,
	});
};

export const useExplainCode = () => {
	return useMutation({
		mutationFn: explainCode,
	});
};
