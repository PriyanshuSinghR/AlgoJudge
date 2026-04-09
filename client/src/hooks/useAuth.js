import { getCurrentUser, signin, signout, signup } from "@/api/authApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useCurrentUser = () => {
	return useQuery({
		queryKey: ["auth"],
		queryFn: async () => {
			try {
				const res = await getCurrentUser();
				return res.data.user ?? null;
			} catch (error) {
				if (error?.response?.status === 401) {
					return null;
				}
				throw error;
			}
		},
		retry: false,
		staleTime: Infinity,
		gcTime: Infinity,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	});
};

export const useSignOut = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: signout,
		onSuccess: () => {
			queryClient.setQueryData(["auth"], null);
		},
	});
};
