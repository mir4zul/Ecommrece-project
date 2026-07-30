import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    ArrowRightIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("login"), { onFinish: () => reset("password") });
    };

    return (
        <GuestLayout>
            <Head title="Sign in" />
            <div className="mb-8">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                    Welcome back
                </p>
                <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                    Sign in to Shoplio
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Enter your account details to continue shopping.
                </p>
            </div>

            {status && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="text-sm font-bold text-slate-700 dark:text-slate-200"
                    >
                        Email address
                    </label>
                    <div className="relative mt-2">
                        <EnvelopeIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(event) =>
                                setData("email", event.target.value)
                            }
                            autoComplete="username"
                            autoFocus
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-xl border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <div className="flex items-center justify-between gap-4">
                        <label
                            htmlFor="password"
                            className="text-sm font-bold text-slate-700 dark:text-slate-200"
                        >
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <div className="relative mt-2">
                        <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(event) =>
                                setData("password", event.target.value)
                            }
                            autoComplete="current-password"
                            required
                            placeholder="Enter your password"
                            className="w-full rounded-xl border-slate-300 bg-white py-3 pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((visible) => !visible)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="size-5" />
                            ) : (
                                <EyeIcon className="size-5" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <label className="flex w-fit items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Checkbox
                        checked={data.remember}
                        onChange={(event) =>
                            setData("remember", event.target.checked)
                        }
                    />
                    Keep me signed in
                </label>

                <button
                    disabled={processing}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? "Signing in..." : "Sign in"}
                    {!processing && (
                        <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
                    )}
                </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                New to Shoplio?{" "}
                <Link
                    href={route("register")}
                    className="font-bold text-red-600 hover:text-red-700 dark:text-red-400"
                >
                    Create an account
                </Link>
            </p>
        </GuestLayout>
    );
}
