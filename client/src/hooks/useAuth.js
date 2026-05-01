import {
	changePassword,
	getCurrentUser,
	signin,
	signout,
	signup,
	updateCurrentUser,
} from "@/api/authApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useSignIn = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: signin,
		onSuccess: (res) => {
			localStorage.setItem("token", res.data.token);
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
	const token = localStorage.getItem("token");

	return useQuery({
		queryKey: ["auth"],
		queryFn: async () => {
			const res = await getCurrentUser();
			return res.data.user ?? null;
		},
		enabled: !!token, // 🔥 prevents useless calls
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
			localStorage.removeItem("token");
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

export const useUpdateCurrentUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCurrentUser,
		onSuccess: (response) => {
			queryClient.setQueryData(["auth"], response.data.user);
		},
	});
};

export const useChangePassword = () => {
	return useMutation({
		mutationFn: changePassword,
	});
};
