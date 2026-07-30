import logo from "@/assets/shoplio-logo.svg";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
} from "react-icons/fa6";

const sections = [
    {
        title: "Information",
        links: [
            "Delivery Information",
            "Privacy Policy",
            "Terms & Conditions",
            "Contact Us",
            "Returns",
        ],
    },
    {
        title: "Customer Care",
        links: [
            "My Account",
            "Order History",
            "Address Book",
            "Wish List",
            "Frequently Asked Questions",
        ],
    },
];

const socialLinks = [
    { label: "Twitter", icon: FaTwitter },
    { label: "Facebook", icon: FaFacebook },
    { label: "Instagram", icon: FaInstagram },
    { label: "LinkedIn", icon: FaLinkedin },
];

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-100 text-slate-600 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 py-12 sm:grid-cols-2 sm:py-14 lg:grid-cols-6 lg:gap-8 lg:py-16">
                    {sections.map((section) => (
                        <section key={section.title}>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                    {section.title}
                                </h2>
                                <span className="h-0.5 w-6 rounded-full bg-red-600" />
                            </div>
                            <ul className="mt-5 space-y-3">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="inline-block text-sm transition hover:translate-x-1 hover:text-red-600 dark:hover:text-red-400"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    <section className="text-center sm:col-span-2 lg:col-span-2">
                        <img
                            className="mx-auto w-44 rounded-lg bg-slate-900/90 px-4 py-3 dark:bg-white/10"
                            src={logo}
                            alt="Shoplio"
                        />
                        <div className="mt-6 space-y-2 text-sm leading-6">
                            <p>4710–4890 Breckinridge St, Fayetteville</p>
                            <a
                                href="tel:+800345678"
                                className="block transition hover:text-red-600 dark:hover:text-red-400"
                            >
                                (+800) 345 678
                            </a>
                            <a
                                href="mailto:contact@domain.com"
                                className="block transition hover:text-red-600 dark:hover:text-red-400"
                            >
                                contact@domain.com
                            </a>
                        </div>
                        <div className="mt-5 flex justify-center gap-3">
                            {socialLinks.map(({ label, icon: Icon }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    className="flex size-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-600 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-500 dark:hover:bg-red-600"
                                >
                                    <Icon className="size-4" />
                                </a>
                            ))}
                        </div>
                    </section>

                    <section className="sm:col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                Sign Up For Newsletters
                            </h2>
                            <span className="h-0.5 w-6 rounded-full bg-red-600" />
                        </div>
                        <p className="mt-5 text-sm leading-6">
                            Subscribe to our newsletter and get 20% off your
                            first purchase.
                        </p>
                        <form
                            className="mt-5 space-y-3"
                            onSubmit={(event) => event.preventDefault()}
                        >
                            <label htmlFor="footer-email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="footer-email"
                                type="email"
                                required
                                placeholder="Email address"
                                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                            />
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 sm:w-auto"
                            >
                                Subscribe
                            </button>
                        </form>
                    </section>
                </div>

                <div className="flex flex-col gap-2 border-t border-slate-200 py-5 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:text-left dark:border-slate-800">
                    <p>
                        © {new Date().getFullYear()} Shoplio. All rights
                        reserved.
                    </p>
                    <p>Secure shopping · Fast delivery · Easy returns</p>
                </div>
            </div>
        </footer>
    );
}
