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
				console.error("Error fetching current user:", error);
				return null;
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
			Object.keys(localStorage).forEach((key) => {
				if (key.startsWith("code-")) {
					localStorage.removeItem(key);
				}
			});

			localStorage.removeItem("selected-lang");

			queryClient.setQueryData(["auth"], null);
		},
	});
};
