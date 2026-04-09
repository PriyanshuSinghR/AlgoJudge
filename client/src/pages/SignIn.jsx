import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignIn } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export default function SignInPage() {
	const toast = useToast();
	const { mutate: signIn } = useSignIn();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	const onSubmit = (data) => {
		signIn(data, {
			onSuccess: () => {
				toast.success("Login successful");
			},

			onError: (error) => {
				toast.error(
					"Signin failed",
					error?.response?.data?.error ||
						error?.message ||
						"Something went wrong while signing in.",
				);
			},
		});
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-muted">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<Input placeholder="Email" {...register("email")} />
							{errors.email && (
								<p className="text-red-500 text-sm">Invalid email</p>
							)}
						</div>

						<div>
							<Input
								type="password"
								placeholder="Password"
								{...register("password")}
							/>
							{errors.password && (
								<p className="text-red-500 text-sm">
									Password must be at least 6 characters
								</p>
							)}
						</div>

						<Button type="submit" className="w-full">
							Sign In
						</Button>

						<p className="text-sm text-center">
							Don't have an account?{" "}
							<a href="/signup" className="underline">
								Sign up
							</a>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
