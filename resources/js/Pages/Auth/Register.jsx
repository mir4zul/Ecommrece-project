import InputError from "@/Components/InputError";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    ArrowRightIcon,
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
    LockClosedIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const fieldClass =
        "w-full rounded-xl border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white";

    return (
        <GuestLayout>
            <Head title="Create account" />
            <div className="mb-7">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                    Join Shoplio
                </p>
                <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                    Create your account
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    One account for faster checkout, wishlists and live order
                    tracking.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label
                        htmlFor="name"
                        className="text-sm font-bold text-slate-700 dark:text-slate-200"
                    >
                        Full name
                    </label>
                    <div className="relative mt-2">
                        <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                        <input
                            id="name"
                            value={data.name}
                            onChange={(event) =>
                                setData("name", event.target.value)
                            }
                            autoComplete="name"
                            autoFocus
                            required
                            placeholder="Your full name"
                            className={fieldClass}
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                            required
                            placeholder="you@example.com"
                            className={fieldClass}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-bold text-slate-700 dark:text-slate-200"
                        >
                            Password
                        </label>
                        <div className="relative mt-2">
                            <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(event) =>
                                    setData("password", event.target.value)
                                }
                                autoComplete="new-password"
                                required
                                placeholder="Min. 8 characters"
                                className={`${fieldClass} pr-11`}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((visible) => !visible)
                                }
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                                aria-label={
                                    showPassword
                                        ? "Hide passwords"
                                        : "Show passwords"
                                }
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="size-5" />
                                ) : (
                                    <EyeIcon className="size-5" />
                                )}
                            </button>
                        </div>
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="text-sm font-bold text-slate-700 dark:text-slate-200"
                        >
                            Confirm password
                        </label>
                        <div className="relative mt-2">
                            <LockClosedIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                            <input
                                id="password_confirmation"
                                type={showPassword ? "text" : "password"}
                                value={data.password_confirmation}
                                onChange={(event) =>
                                    setData(
                                        "password_confirmation",
                                        event.target.value,
                                    )
                                }
                                autoComplete="new-password"
                                required
                                placeholder="Repeat password"
                                className={fieldClass}
                            />
                        </div>
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                    By creating an account, you agree to Shoplio&apos;s Terms of
                    Service and Privacy Policy.
                </p>

                <button
                    disabled={processing}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {processing ? "Creating account..." : "Create account"}
                    {!processing && (
                        <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                    href={route("login")}
                    className="font-bold text-red-600 hover:text-red-700 dark:text-red-400"
                >
                    Sign in
                </Link>
            </p>
        </GuestLayout>
    );
}
