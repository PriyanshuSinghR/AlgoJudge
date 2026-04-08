import { signin, signup } from "@/api/authApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ✅ Create tender mutation
export const useSignIn = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: signin,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["auth"] });
		},
	});
};

export const useSignUp = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: signup,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["auth"] });
		},
	});
};
