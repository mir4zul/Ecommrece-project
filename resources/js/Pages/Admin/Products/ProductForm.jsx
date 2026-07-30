import { Link, useForm } from "@inertiajs/react";

const emptyImages = ["", "", "", ""];

export default function ProductForm({ product = null, categories = [] }) {
    const editing = Boolean(product);
    const { data, setData, post, put, processing, errors } = useForm({
        name: product?.name ?? "",
        category: product?.category ?? "",
        price: product?.price ?? "",
        discount_price: product?.discount_price ?? "",
        description: product?.description ?? "",
        stock: product?.stock ?? 0,
        rating: product?.rating ?? 0,
        is_new: Boolean(product?.is_new),
        is_top_rated: Boolean(product?.is_top_rated),
        images: product?.images?.length >= 4 ? product.images : emptyImages,
    });

    const updateImage = (index, value) => {
        const images = [...data.images];
        images[index] = value;
        setData("images", images);
    };

    const submit = (event) => {
        event.preventDefault();
        if (editing) put(route("admin.products.update", product.id));
        else post(route("admin.products.store"));
    };

    const fieldClass =
        "mt-1 w-full rounded-lg border-slate-300 bg-white text-slate-800 focus:border-red-500 focus:ring-red-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white";
    const error = (name) =>
        errors[name] && (
            <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
        );

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-800">
                <label className="text-sm font-medium">
                    Product name
                    <input
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={fieldClass}
                    />
                    {error("name")}
                </label>
                <label className="text-sm font-medium">
                    Category
                    <input
                        list="product-categories"
                        value={data.category}
                        onChange={(e) => setData("category", e.target.value)}
                        className={fieldClass}
                    />
                    <datalist id="product-categories">
                        {categories.map((category) => (
                            <option key={category} value={category} />
                        ))}
                    </datalist>
                    {error("category")}
                </label>
                <label className="text-sm font-medium">
                    Price ($)
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price}
                        onChange={(e) => setData("price", e.target.value)}
                        className={fieldClass}
                    />
                    {error("price")}
                </label>
                <label className="text-sm font-medium">
                    Discount (%)
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={data.discount_price}
                        onChange={(e) =>
                            setData("discount_price", e.target.value)
                        }
                        className={fieldClass}
                    />
                    {error("discount_price")}
                </label>
                <label className="text-sm font-medium">
                    Stock
                    <input
                        type="number"
                        min="0"
                        value={data.stock}
                        onChange={(e) => setData("stock", e.target.value)}
                        className={fieldClass}
                    />
                    {error("stock")}
                </label>
                <label className="text-sm font-medium">
                    Rating
                    <input
                        type="number"
                        min="0"
                        max="5"
                        value={data.rating}
                        onChange={(e) => setData("rating", e.target.value)}
                        className={fieldClass}
                    />
                    {error("rating")}
                </label>
                <label className="text-sm font-medium md:col-span-2">
                    Description
                    <textarea
                        rows="5"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className={fieldClass}
                    />
                    {error("description")}
                </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h2 className="font-bold">Product gallery</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Add at least four valid image URLs. The first image is the
                    main product image.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {data.images.map((image, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                        >
                            <label className="text-sm font-medium">
                                Image {index + 1}
                                <input
                                    type="url"
                                    value={image}
                                    onChange={(e) =>
                                        updateImage(index, e.target.value)
                                    }
                                    placeholder="https://example.com/product.jpg"
                                    className={fieldClass}
                                />
                            </label>
                            {error(`images.${index}`)}
                            {image && (
                                <img
                                    src={image}
                                    alt=""
                                    className="mt-3 h-32 w-full rounded-lg bg-slate-100 object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>
                {error("images")}
            </div>

            <div className="flex flex-wrap gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={data.is_new}
                        onChange={(e) => setData("is_new", e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500"
                    />
                    New arrival
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={data.is_top_rated}
                        onChange={(e) =>
                            setData("is_top_rated", e.target.checked)
                        }
                        className="rounded text-red-600 focus:ring-red-500"
                    />
                    Top rated
                </label>
            </div>

            <div className="flex justify-end gap-3">
                <Link
                    href={route("admin.products.index")}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {processing
                        ? "Saving..."
                        : editing
                          ? "Update Product"
                          : "Create Product"}
                </button>
            </div>
        </form>
    );
}
