import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";

const mobileBankingOptions = [
    { value: "bkash", name: "bKash", badge: "b", color: "bg-pink-600" },
    { value: "nagad", name: "Nagad", badge: "N", color: "bg-orange-600" },
    { value: "rocket", name: "Rocket", badge: "R", color: "bg-violet-700" },
    { value: "upay", name: "Upay", badge: "U", color: "bg-emerald-600" },
];

const bankOptions = [
    { value: "bank_dutch_bangla", name: "Dutch-Bangla Bank", short: "DBBL" },
    { value: "bank_brac", name: "BRAC Bank", short: "BRAC" },
    { value: "bank_city", name: "City Bank", short: "CITY" },
    { value: "bank_ebl", name: "Eastern Bank", short: "EBL" },
    { value: "bank_islami", name: "Islami Bank Bangladesh", short: "IBBL" },
    { value: "bank_sonali", name: "Sonali Bank", short: "SBL" },
];
const bangladeshDistricts = [
    "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura",
    "Brahmanbaria", "Chandpur", "Chapai Nawabganj", "Chattogram", "Chuadanga",
    "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni",
    "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore",
    "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna",
    "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat",
    "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
    "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj",
    "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna",
    "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi",
    "Rangamati", "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj",
    "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
];

export default function Checkout({
    carts = [],
    wishlists = [],
    summary = {},
    shipping = { free_offer: false, inside_dhaka_fee: 100, outside_dhaka_fee: 150 },
}) {
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [paymentType, setPaymentType] = useState("cash");
    const { data, setData, post, processing, errors } = useForm({
        customer_name: user?.name ?? "",
        customer_email: user?.email ?? "",
        customer_phone: "",
        shipping_address: "",
        shipping_city: "",
        shipping_postal_code: "",
        payment_method: "cash_on_delivery",
    });    const normalizedCity = data.shipping_city.trim().toLocaleLowerCase();
    const isInsideDhaka =
        normalizedCity === "dhaka" ||
        normalizedCity.includes("dhaka city") ||
        normalizedCity.includes("ঢাকা");
    const shippingFee =
        Number(summary.subtotal) > 0
            ? shipping.free_offer
                ? 0
                : Number(
                      isInsideDhaka
                          ? shipping.inside_dhaka_fee
                          : shipping.outside_dhaka_fee,
                  )
            : 0;
    const checkoutTotal =
        Number(summary.subtotal) - Number(summary.discount ?? 0) + shippingFee;
    const submit = (event) => {
        event.preventDefault();
        post(route("checkout.store"));
    };
    const inputClass =
        "mt-1 w-full rounded-lg border-gray-300 bg-white text-gray-800 focus:border-red-500 focus:ring-red-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500";
    const error = (field) =>
        errors[field] && (
            <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
        );
    const choosePaymentType = (type) => {
        setPaymentType(type);
        setData(
            "payment_method",
            type === "mobile"
                ? "bkash"
                : type === "bank"
                  ? "bank_dutch_bangla"
                  : "cash_on_delivery",
        );
    };

    return (
        <>
            <Head title="Checkout" />
            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
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
                        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
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
                                    District / City
                                    <select
                                        value={data.shipping_city}
                                        onChange={(e) =>
                                            setData(
                                                "shipping_city",
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        <option value="">Select a district</option>
                                        {bangladeshDistricts.map((district) => (
                                            <option key={district} value={district}>
                                                {district}
                                            </option>
                                        ))}
                                    </select>
                                    {error("shipping_city")}
                                    <span className="mt-1 block text-xs text-gray-500 dark:text-slate-400">
                                        {shipping.free_offer
                                            ? "Free shipping offer is active"
                                            : `Dhaka ৳${Number(shipping.inside_dhaka_fee).toFixed(0)} · Outside Dhaka ৳${Number(shipping.outside_dhaka_fee).toFixed(0)}`}
                                    </span>
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
                                <div className="sm:col-span-2">
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Payment method
                                    </h3>
                                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                        {[
                                            ["cash", "Cash on delivery", "Pay when your order arrives"],
                                            ["mobile", "Mobile banking", "bKash, Nagad, Rocket or Upay"],
                                            ["bank", "Bank payment", "Choose a Bangladeshi bank"],
                                        ].map(([type, title, description]) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => choosePaymentType(type)}
                                                className={`rounded-xl border-2 p-4 text-left transition ${
                                                    paymentType === type
                                                        ? "border-red-500 bg-red-50 ring-2 ring-red-100 dark:border-red-400 dark:bg-red-950/40 dark:ring-red-900/60"
                                                        : "border-gray-200 hover:border-red-200 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-500"
                                                }`}
                                            >
                                                <span className="block text-sm font-bold text-gray-900 dark:text-white">
                                                    {title}
                                                </span>
                                                <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-slate-400">
                                                    {description}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {paymentType === "mobile" && (
                                        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-800/70">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        Select mobile banking
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                                        Choose your preferred Bangladesh payment service.
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                                                    Secure
                                                </span>
                                            </div>
                                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                                {mobileBankingOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        onClick={() => setData("payment_method", option.value)}
                                                        className={`flex min-h-24 flex-col items-center justify-center rounded-xl border-2 bg-white p-3 transition dark:bg-slate-900 ${
                                                            data.payment_method === option.value
                                                                ? "border-red-500 shadow-md"
                                                                : "border-transparent hover:border-gray-300 dark:hover:border-slate-600"
                                                        }`}
                                                    >
                                                        <span className={`grid size-10 place-items-center rounded-xl text-lg font-black text-white ${option.color}`}>
                                                            {option.badge}
                                                        </span>
                                                        <span className="mt-2 text-sm font-bold text-gray-800 dark:text-slate-100">
                                                            {option.name}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                                                You will be redirected to the secure SSLCOMMERZ gateway to complete payment.
                                            </p>
                                        </div>
                                    )}

                                    {paymentType === "bank" && (
                                        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-800/70">
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                Select a Bangladeshi bank
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                                                Choose the bank you want to use for payment.
                                            </p>
                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                {bankOptions.map((bank) => (
                                                    <button
                                                        key={bank.value}
                                                        type="button"
                                                        onClick={() => setData("payment_method", bank.value)}
                                                        className={`flex items-center gap-3 rounded-xl border-2 bg-white p-3 text-left transition dark:bg-slate-900 ${
                                                            data.payment_method === bank.value
                                                                ? "border-red-500 shadow-md"
                                                                : "border-transparent hover:border-gray-300 dark:hover:border-slate-600"
                                                        }`}
                                                    >
                                                        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-slate-900 text-xs font-black text-white">
                                                            {bank.short}
                                                        </span>
                                                        <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                                                            {bank.name}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
                                                You will be redirected to the secure gateway to choose the available bank channel.
                                            </p>
                                        </div>
                                    )}
                                    {error("payment_method")}
                                </div>
                            </div>
                        </section>
                        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 dark:border-slate-800 dark:bg-slate-900">
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
                                                {cart.quantity} × ৳
                                                {Number(
                                                    cart.unit_price,
                                                ).toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold">
                                            ৳
                                            {Number(cart.line_total).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <dl className="mt-5 space-y-3 border-t border-gray-200 dark:border-slate-700 pt-5 text-sm">
                                <div className="flex justify-between">
                                    <dt>Subtotal</dt>
                                    <dd>
                                        ৳{Number(summary.subtotal).toFixed(2)}
                                    </dd>
                                </div>                                {Number(summary.discount) > 0 && (
                                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                                        <dt>Discount</dt>
                                        <dd>
                                            −৳{Number(summary.discount).toFixed(2)}
                                        </dd>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <dt>Shipping</dt>
                                    <dd className="text-right">
                                        <span className="block">
                                            {shippingFee === 0
                                                ? "Free"
                                                : `৳${shippingFee.toFixed(2)}`}
                                        </span>
                                        {!shipping.free_offer && data.shipping_city && (
                                            <span className="text-xs font-normal text-gray-500 dark:text-slate-400">
                                                {isInsideDhaka ? "Inside Dhaka" : "Outside Dhaka"}
                                            </span>
                                        )}
                                    </dd>
                                </div>
                                <div className="flex justify-between border-t pt-3 text-base font-bold">
                                    <dt>Total</dt>
                                    <dd>৳{checkoutTotal.toFixed(2)}</dd>
                                </div>
                            </dl>
                            <button
                                disabled={processing}
                                className="mt-6 w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {processing
                                    ? "Processing..."
                                    : paymentType === "cash"
                                      ? "Place Order"
                                      : "Pay Securely"}
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
