import logo from "@/assets/shophunt-logo.png";
import {
    CheckCircleIcon,
    ShieldCheckIcon,
    SparklesIcon,
    TruckIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";

const benefits = [
    { icon: ShieldCheckIcon, text: "Secure checkout and protected account" },
    {
        icon: TruckIcon,
        text: "Track every order from confirmation to delivery",
    },
    { icon: SparklesIcon, text: "Save favourites and discover better deals" },
];

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid lg:grid-cols-[minmax(22rem,0.9fr)_minmax(34rem,1.1fr)]">
            <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col xl:p-14">
                <div className="absolute -left-24 -top-24 size-80 rounded-full bg-red-600/25 blur-3xl" />
                <div className="absolute -bottom-28 -right-20 size-96 rounded-full bg-violet-600/20 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.09),transparent_28%),linear-gradient(145deg,rgba(15,23,42,0.2),rgba(76,5,25,0.45))]" />

                <Link href="/" className="relative z-10 inline-flex w-fit">
                    <img
                        src={logo}
                        alt="ShopHunt home"
                        className="h-20 w-auto"
                    />
                </Link>

                <div className="relative z-10 my-auto max-w-lg py-14">
                    <p className="text-sm font-bold uppercase tracking-[0.28em] text-red-300">
                        Shop smarter
                    </p>
                    <h1 className="mt-5 text-4xl font-black leading-tight xl:text-5xl">
                        Your favourite products, all in one place.
                    </h1>
                    <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                        Sign in to enjoy a faster checkout, live order tracking,
                        wishlists and personalised shopping.
                    </p>
                    <div className="mt-10 space-y-5">
                        {benefits.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-4">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                                    <Icon className="size-5 text-red-300" />
                                </span>
                                <p className="text-sm font-semibold text-slate-200">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-xs text-slate-500">
                    © {new Date().getFullYear()} Shoplio. Secure shopping,
                    simplified.
                </p>
            </aside>

            <main className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-red-50 to-transparent dark:from-red-950/20 lg:hidden" />
                <div className="relative w-full max-w-lg">
                    <Link
                        href="/"
                        className="mb-8 flex justify-center lg:hidden"
                    >
                        <span className="rounded-2xl bg-slate-950 px-6 py-4 shadow-xl">
                            <img
                                src={logo}
                                alt="ShopHunt home"
                                className="h-16 w-auto"
                            />
                        </span>
                    </Link>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                        {children}
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <CheckCircleIcon className="size-4 text-emerald-500" />
                        Your information is encrypted and secure
                    </div>
                </div>
            </main>
        </div>
    );
}
