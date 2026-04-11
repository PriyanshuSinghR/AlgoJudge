// src/hooks/useProblems.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getProblems,
	getProblemBySlug,
	createProblem,
	updateProblem,
	deleteProblem,
} from "@/api/problemApi";

export const useProblems = () => {
	return useQuery({
		queryKey: ["problems"],
		queryFn: async () => {
			const res = await getProblems();
			return res.data.data;
		},
	});
};

export const useProblem = (slug) => {
	return useQuery({
		queryKey: ["problem", slug],
		queryFn: async () => {
			const res = await getProblemBySlug(slug);
			return res.data.data;
		},
		enabled: !!slug, // important
	});
};

export const useCreateProblem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProblem,
		onSuccess: () => {
			queryClient.invalidateQueries(["problems"]);
		},
	});
};

export const useUpdateProblem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, payload }) => updateProblem(id, payload),

		onSuccess: (data) => {
			queryClient.invalidateQueries(["problems"]);
			queryClient.invalidateQueries(["problem", data?.data?.slug]);
		},
	});
};

export const useDeleteProblem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProblem,
		onSuccess: () => {
			queryClient.invalidateQueries(["problems"]);
		},
	});
};
