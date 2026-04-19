// pages/Profile.jsx

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
	ArrowLeft,
	CalendarDays,
	Clock3,
	Mail,
	Pencil,
	Save,
	ShieldCheck,
	Sparkles,
	User2,
	X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCurrentUser, useUpdateCurrentUser } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
	const navigate = useNavigate();
	const { data: user } = useCurrentUser();
	const { mutate: updateProfile, isPending } = useUpdateCurrentUser();
	const [isEditing, setIsEditing] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
		},
	});

	useEffect(() => {
		if (user) {
			reset({
				name: user.name || "",
				email: user.email || "",
			});
		}
	}, [user, reset]);

	const initials = useMemo(() => {
		if (!user?.name) return "U";

		return user.name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.slice(0, 2)
			.toUpperCase();
	}, [user]);

	const onSubmit = (data) => {
		updateProfile(data, {
			onSuccess: (response) => {
				reset({
					name: response.data.user.name,
					email: response.data.user.email,
				});

				setIsEditing(false);
			},
		});
	};

	if (!user) {
		return (
			<div className="flex h-[calc(100vh-120px)] items-center justify-center px-6">
				<div className="rounded-[32px] border border-dashed border-zinc-300 bg-white/70 p-10 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
					<p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
						User not found
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-[calc(100vh-120px)] px-4 py-6 md:px-8">
			<div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-zinc-200/70 bg-white shadow-[0_20px_80px_-20px_rgba(0,0,0,0.18)] dark:border-zinc-800 dark:bg-zinc-900">
				<div className="grid min-h-[600px] lg:grid-cols-[42%_58%]">
					<div className="relative hidden overflow-hidden bg-[#0a0a0f] px-10 py-10 lg:flex lg:flex-col lg:justify-between">
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
								Profile Overview
							</div>

							<h1 className="mt-5 text-[42px] font-extrabold leading-[1.05] tracking-[-0.04em] text-white">
								Manage your
								<br />
								<span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
									account profile.
								</span>
							</h1>

							<p className="mt-5 max-w-[320px] font-mono text-[13.5px] font-light leading-7 text-white/45">
								Keep your personal details updated so your coding journey,
								account information, and profile stay accurate.
							</p>
						</div>

						<div className="relative z-10 space-y-4">
							<div className="space-y-3">
								<div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-sm">
									<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15">
										<CalendarDays className="h-5 w-5 text-indigo-400" />
									</div>
									<div>
										<p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
											Joined
										</p>
										<p className="mt-1 text-sm font-semibold text-white">
											{new Date(user.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-sm">
									<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-500/15">
										<Clock3 className="h-5 w-5 text-pink-400" />
									</div>
									<div>
										<p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
											Last Updated
										</p>
										<p className="mt-1 text-sm font-semibold text-white">
											{new Date(user.updatedAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="absolute bottom-8 right-10 text-[120px] font-extrabold leading-none tracking-[-0.06em] text-white/[0.03]">
							03
						</div>
					</div>

					<div className="relative overflow-hidden bg-[#f4f3f0] px-6 py-10 sm:px-10 lg:px-14 dark:bg-zinc-950">
						<div className="absolute -right-16 -top-16 h-[260px] w-[260px] rounded-full bg-indigo-500/10" />
						<div className="absolute -bottom-20 -left-10 h-[320px] w-[320px] rounded-full bg-pink-500/10" />

						<div className="relative z-10 mx-auto w-full max-w-[480px]">
							<div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-500">
								Your account
							</div>

							<h2 className="text-[36px] font-extrabold leading-none tracking-[-0.04em] text-zinc-950 dark:text-white">
								Profile Details
							</h2>

							<p className="mb-8 mt-2 font-mono text-[13px] font-light text-zinc-500">
								Update your information and keep your account up to date.
							</p>

							<div className="space-y-5">
								<div>
									<label className="mb-2 block font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-zinc-700 dark:text-zinc-300">
										Full Name
									</label>

									<div className="relative">
										<User2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

										<Input
											{...register("name")}
											disabled={!isEditing}
											className="h-12 rounded-[10px] border-zinc-200 bg-white pl-11 pr-4 font-mono text-[14px] text-zinc-900 placeholder:text-zinc-300 disabled:cursor-default disabled:opacity-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
										/>
									</div>
								</div>

								<div>
									<label className="mb-2 block font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-zinc-700 dark:text-zinc-300">
										Email Address
									</label>

									<div className="relative">
										<Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

										<Input
											type="email"
											{...register("email")}
											disabled={!isEditing}
											className="h-12 rounded-[10px] border-zinc-200 bg-white pl-11 pr-4 font-mono text-[14px] text-zinc-900 placeholder:text-zinc-300 disabled:cursor-default disabled:opacity-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
										/>
									</div>
								</div>

								<div className="grid gap-4 pt-2 sm:grid-cols-2">
									<div className="rounded-[20px] border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
										<div className="mb-2 flex items-center gap-2">
											<ShieldCheck className="h-4 w-4 text-indigo-500" />
											<p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
												Status
											</p>
										</div>
										<p className="text-sm font-semibold text-zinc-900 dark:text-white">
											Verified User
										</p>
									</div>

									<div className="rounded-[20px] border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
										<div className="mb-2 flex items-center gap-2">
											<Sparkles className="h-4 w-4 text-pink-500" />
											<p className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-500">
												Role
											</p>
										</div>
										<p className="text-sm font-semibold text-zinc-900 dark:text-white">
											OJ Explorer
										</p>
									</div>
								</div>

								<div className="flex flex-wrap gap-3 pt-4">
									{isEditing ? (
										<>
											<Button
												type="button"
												onClick={() => {
													reset({
														name: user.name || "",
														email: user.email || "",
													});
													setIsEditing(false);
												}}
												variant="outline"
												className="h-[50px] rounded-[10px] border-zinc-200 px-6 font-semibold dark:border-zinc-700"
											>
												<X className="mr-2 h-4 w-4" />
												Cancel
											</Button>

											<Button
												onClick={handleSubmit(onSubmit)}
												disabled={!isDirty || isPending}
												className="group relative h-[50px] flex-1 overflow-hidden rounded-[10px] bg-zinc-950 font-semibold tracking-[0.04em] text-white shadow-[0_4px_20px_rgba(10,10,15,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)] dark:bg-white dark:text-zinc-900"
											>
												<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

												<span className="relative z-10 flex items-center justify-center gap-2">
													<Save className="h-4 w-4" />
													{isPending ? "Saving..." : "Save Changes"}
												</span>
											</Button>
										</>
									) : (
										<Button
											onClick={() => setIsEditing(true)}
											className="group relative h-[50px] w-full overflow-hidden rounded-[10px] bg-zinc-950 font-semibold tracking-[0.04em] text-white shadow-[0_4px_20px_rgba(10,10,15,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(99,102,241,0.35)] dark:bg-white dark:text-zinc-900"
										>
											<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

											<span className="relative z-10 flex items-center justify-center gap-2">
												<Pencil className="h-4 w-4" />
												Edit Profile
											</span>
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
