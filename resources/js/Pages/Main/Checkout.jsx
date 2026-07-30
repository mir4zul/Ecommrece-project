import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Checkout({ carts = [], wishlists = [], summary = {} }) {
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        customer_name: user?.name ?? "",
        customer_email: user?.email ?? "",
        customer_phone: "",
        shipping_address: "",
        shipping_city: "",
        shipping_postal_code: "",
        payment_method: "cash_on_delivery",
    });
    const submit = (event) => {
        event.preventDefault();
        post(route("checkout.store"));
    };
    const inputClass =
        "mt-1 w-full rounded-lg border-gray-300 bg-white text-gray-800 focus:border-red-500 focus:ring-red-500";
    const error = (field) =>
        errors[field] && (
            <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
        );

    return (
        <>
            <Head title="Checkout" />
            <div className="min-h-screen bg-gray-50">
                <div className="h-[85px] bg-slate-900">
                    <Header
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                        carts={carts}
                        wishlists={wishlists}
                    />
                </div>
                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-widest text-red-600">
                            Secure checkout
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            Checkout
                        </h1>
                    </div>
                    {errors.cart && (
                        <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-800">
                            {errors.cart}
                        </div>
                    )}
                    <form
                        onSubmit={submit}
                        className="grid gap-8 lg:grid-cols-[1fr_24rem]"
                    >
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                            <h2 className="text-xl font-bold">
                                Delivery Information
                            </h2>
                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                <label className="text-sm font-medium">
                                    Full name
                                    <input
                                        value={data.customer_name}
                                        onChange={(e) =>
                                            setData(
                                                "customer_name",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {error("customer_name")}
                                </label>
                                <label className="text-sm font-medium">
                                    Email
                                    <input
                                        type="email"
                                        value={data.customer_email}
                                        onChange={(e) =>
                                            setData(
                                                "customer_email",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {error("customer_email")}
                                </label>
                                <label className="text-sm font-medium">
                                    Phone
                                    <input
                                        value={data.customer_phone}
                                        onChange={(e) =>
                                            setData(
                                                "customer_phone",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {error("customer_phone")}
                                </label>
                                <label className="text-sm font-medium">
                                    City
                                    <input
                                        value={data.shipping_city}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_city",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {error("shipping_city")}
                                </label>
                                <label className="text-sm font-medium sm:col-span-2">
                                    Address
                                    <textarea
                                        rows="4"
                                        value={data.shipping_address}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_address",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {error("shipping_address")}
                                </label>
                                <label className="text-sm font-medium">
                                    Postal code
                                    <input
                                        value={data.shipping_postal_code}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_postal_code",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    />
                                    {error("shipping_postal_code")}
                                </label>
                                <label className="text-sm font-medium">
                                    Payment method
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) =>
                                            setData(
                                                "payment_method",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        <option value="cash_on_delivery">
                                            Cash on delivery
                                        </option>
                                        <option value="bank_transfer">
                                            Bank transfer
                                        </option>
                                    </select>
                                    {error("payment_method")}
                                </label>
                            </div>
                        </section>
                        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                            <h2 className="text-lg font-bold">Your Order</h2>
                            <div className="mt-5 max-h-64 space-y-4 overflow-y-auto">
                                {carts.map((cart) => (
                                    <div key={cart.id} className="flex gap-3">
                                        <img
                                            src={cart.image}
                                            alt=""
                                            className="size-14 rounded-lg object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {cart.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {cart.quantity} × $
                                                {Number(
                                                    cart.unit_price,
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            $
                                            {Number(cart.line_total).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <dl className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm">
                                <div className="flex justify-between">
                                    <dt>Subtotal</dt>
                                    <dd>
                                        ${Number(summary.subtotal).toFixed(2)}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Shipping</dt>
                                    <dd>
                                        {Number(summary.shipping) === 0
                                            ? "Free"
                                            : `$${Number(summary.shipping).toFixed(2)}`}
                                    </dd>
                                </div>
                                <div className="flex justify-between border-t pt-3 text-base font-bold">
                                    <dt>Total</dt>
                                    <dd>${Number(summary.total).toFixed(2)}</dd>
                                </div>
                            </dl>
                            <button
                                disabled={processing}
                                className="mt-6 w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "Placing Order..."
                                    : "Place Order"}
                            </button>
                            <Link
                                href={route("cart.index")}
                                className="mt-3 block text-center text-sm text-gray-500 hover:text-red-600"
                            >
                                Back to cart
                            </Link>
                        </aside>
                    </form>
                </main>
                <Footer />
            </div>
        </>
    );
}
