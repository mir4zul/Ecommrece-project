import SimpleProductCard from "./SimpleProductCard";

const ProductColumn = ({ title, products }) => (
    <section className="space-y-6 sm:space-y-8">
        <div className="pb-2 text-center lg:text-left">
            <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800">
                {title}
            </h2>
            <p className="mt-2 text-sm text-gray-500">Database demo products</p>
        </div>

        {products.map((product) => (
            <SimpleProductCard key={product.id} {...product} />
        ))}
    </section>
);

export default function ProductCategories({ products = [] }) {
    const featured = products
        .filter((product) => product.is_top_rated)
        .slice(0, 3);
    const bestSale = [...products]
        .sort((first, second) => second.rating - first.rating)
        .slice(0, 3);
    const onSale = products
        .filter((product) => product.discount_price > 0)
        .slice(0, 3);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:max-w-8xl lg:px-8 lg:py-24">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                <ProductColumn title="Featured Products" products={featured} />
                <ProductColumn title="Best Sellers" products={bestSale} />
                <ProductColumn title="On Sale" products={onSale} />
            </div>
        </div>
    );
}
