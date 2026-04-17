import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
	ArrowLeft,
	LogIn,
	Mail,
	LockKeyhole,
	CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

const FEATURES = [
	"Fast login and instant dashboard access",
	"Resume your streaks and active problems",
	"Track submissions, rankings, and progress",
];

export default function SignInPage() {
	const toast = useToast();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const redirectPath = searchParams.get("redirect") || "/";

	const { mutate: signIn, isPending } = useSignIn();

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
				navigate(redirectPath);
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
		<div className="relative flex min-h-[calc(100vh-150px)] overflow-hidden rounded-[32px] border border-zinc-200/70 bg-white shadow-[0_20px_80px_-20px_rgba(0,0,0,0.18)] dark:border-zinc-800 dark:bg-zinc-900">
			<div className="hidden w-[42%] flex-col justify-between overflow-hidden bg-[#0a0a0f] px-11 py-10 lg:flex">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.18),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.12),transparent_45%)]" />

				<div className="absolute inset-0 bg-[repeating-linear-gradient(-55deg,rgba(255,255,255,0.025)_0px,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_48px)]" />

				<div className="relative z-10">
					<Button
						type="button"
						variant="ghost"
						onClick={() => navigate(-1)}
						className="h-auto p-0 font-mono text-[13px] font-medium tracking-[0.04em] text-white/45 hover:bg-transparent hover:text-white/85"
					>
						<ArrowLeft className="mr-2 h-3.5 w-3.5" />
						go back
					</Button>

					<div className="mt-10 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-400">
						<div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
						Algo Judge
					</div>

					<h1 className="mt-5 text-[42px] font-extrabold leading-[1.05] tracking-[-0.04em] text-white">
						Welcome back.
						<br />
						<span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
							Keep solving.
						</span>
					</h1>

					<p className="mt-5 max-w-[300px] font-mono text-[13.5px] font-light leading-7 text-white/45">
						Continue your coding journey, track progress, and improve your rank
						with every submission.
					</p>
				</div>

				<div className="relative z-10 space-y-4">
					{FEATURES.map((feature) => (
						<div
							key={feature}
							className="flex items-center gap-3 font-mono text-[13px] font-light text-white/60"
						>
							<CheckCircle2 className="h-4 w-4 flex-shrink-0 text-indigo-500" />
							<span>{feature}</span>
						</div>
					))}
				</div>

				<div className="absolute bottom-8 right-10 text-[120px] font-extrabold leading-none tracking-[-0.06em] text-white/[0.03]">
					02
				</div>
			</div>

			<div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#f4f3f0] px-6 py-10 sm:px-10 lg:px-14">
				<div className="absolute -right-16 -top-16 h-[260px] w-[260px] rounded-full bg-indigo-500/10" />
				<div className="absolute -bottom-20 -left-10 h-[320px] w-[320px] rounded-full bg-pink-500/10" />

				<div className="relative z-10 w-full max-w-[400px]">
					<div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-500">
						Welcome back
					</div>

					<h2 className="text-[36px] font-extrabold leading-none tracking-[-0.04em] text-zinc-950 dark:text-white">
						Sign in
					</h2>

					<p className="mb-8 mt-2 font-mono text-[13px] font-light text-zinc-500">
						Enter your details to continue.
					</p>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						<div>
							<label className="mb-2 block font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-zinc-700 dark:text-zinc-300">
								Email address
							</label>

							<div className="relative">
								<Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

								<Input
									type="email"
									placeholder="john@example.com"
									className="h-12 rounded-[10px] border-zinc-200 bg-white pl-11 pr-4 font-mono text-[14px] text-zinc-900 placeholder:text-zinc-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
									{...register("email")}
								/>
							</div>

							{errors.email && (
								<p className="mt-1.5 font-mono text-[11px] text-red-500">
									Please enter a valid email
								</p>
							)}
						</div>

						<div>
							<label className="mb-2 block font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-zinc-700 dark:text-zinc-300">
								Password
							</label>

							<div className="relative">
								<LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

								<Input
									type="password"
									placeholder="••••••••"
									className="h-12 rounded-[10px] border-zinc-200 bg-white pl-11 pr-4 font-mono text-[14px] text-zinc-900 placeholder:text-zinc-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
									{...register("password")}
								/>
							</div>

							{errors.password && (
								<p className="mt-1.5 font-mono text-[11px] text-red-500">
									Password must be at least 6 characters
								</p>
							)}
						</div>

						<Button
							type="submit"
							disabled={isPending}
							className="group relative h-[50px] w-full overflow-hidden rounded-[10px] bg-zinc-950 font-semibold tracking-[0.04em] text-white shadow-[0_4px_20px_rgba(10,10,15,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-900"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

							<span className="relative z-10 flex items-center justify-center gap-2">
								<LogIn className="h-4 w-4" />
								{isPending ? "Signing in..." : "Sign In"}
							</span>
						</Button>
					</form>

					<div className="my-5 flex items-center gap-3">
						<div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
						<span className="font-mono text-[11px] text-zinc-400">or</span>
						<div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
					</div>

					<p className="text-center font-mono text-[13px] text-zinc-500">
						Don't have an account?{" "}
						<Link
							to={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
							className="font-semibold text-indigo-500 transition-colors hover:text-pink-500"
						>
							Create one
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
