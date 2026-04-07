import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(6),
});

export default function SignUpPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(schema),
	});

	const onSubmit = (data) => {
		console.log("Signup Data:", data);
		// call API here
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-muted">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Sign Up</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<Input placeholder="Name" {...register("name")} />
							{errors.name && (
								<p className="text-red-500 text-sm">Name is required</p>
							)}
						</div>

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
									Minimum 6 characters required
								</p>
							)}
						</div>

						<Button type="submit" className="w-full">
							Sign Up
						</Button>

						<p className="text-sm text-center">
							Already have an account?{" "}
							<a href="/signin" className="underline">
								Sign in
							</a>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
