import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "../components/Filter.jsx";
import { CartsContext } from "../context/CartsPageProvider.jsx";
import axios from "axios";

function Homepage({ products, searchValue }) {
    const navigate = useNavigate();

    const {
        cartProducts,
        addToCart,
        removeFromCart,
    } = useContext(CartsContext);

    const [filter, setFilter] = useState("All");

    // =================================
    // CART BUTTON
    // =================================

    const handleCartClick = (product) => {
        const cartItem = cartProducts.find(
            (item) => item.id === product.id
        );

        // Already in cart -> Remove
        if (cartItem) {
            removeFromCart(product.id);
            return;
        }

        // Remaining stock check
        const remainingStock =
            product.stock - (cartItem?.quantity || 0);

        if (remainingStock <= 0) {
            return;
        }

        // Add to cart
        addToCart({
            ...product,
            quantity: 1,
        });
    };

    // =================================
    // CHECK PRODUCT IN CART
    // =================================

    const isProductInCart = (id) => {
        return cartProducts.some(
            (item) => item.id === id
        );
    };

    // =================================
    // GET CART QUANTITY
    // =================================

    const getCartQuantity = (id) => {
        const item = cartProducts.find(
            (cartItem) => cartItem.id === id
        );

        return item?.quantity || 0;
    };

    // =================================
    // GET REMAINING STOCK
    // =================================

    const getRemainingStock = (product) => {
        const cartQuantity = getCartQuantity(product.id);

        return Math.max(
            0,
            product.stock - cartQuantity
        );
    };

    // =================================
    // SEARCH + FILTER
    // =================================

    const productsArr = useMemo(() => {
        let result = products;

        // Search
        if (searchValue) {
            result = result.filter((item) =>
                item.title
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            );
        }

        // Category
        if (filter !== "All") {
            result = result.filter(
                (item) => item.category === filter
            );
        }

        return result;
    }, [products, searchValue, filter]);

    // =================================
    // CATEGORIES
    // =================================

    const categories = [
        ...new Set(
            products.map((item) => item.category)
        ),
    ];

    // =================================
    // TRENDING PRODUCTS
    // =================================

    const trendingProducts = [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    // =================================
    // BUY NOW -> SINGLE PRODUCT PAGE
    // =================================

    const handleBuyNow = (product) => {
        navigate("/product", {
            state: {
                item: product,
            },
        });
    };
    // =================================
    // BRANDS
    // =================================

    const brands = [
        ...new Set(
            products
                .map((item) => item.brand)
                .filter(Boolean)
        ),
    ];

   

    return (
        <div className="min-h-screen bg-gray-50">

            {/* =================================
                CATEGORIES
            ================================= */}

            <section className="mx-auto max-w-7xl px-6 py-10">

                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                        Explore
                    </p>

                    <h2 className="mt-1 text-3xl font-bold text-gray-900">
                        Shop by Category
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

                    {categories.map((category) => (

                        <button
                            key={category}
                            onClick={() => {
                                setFilter(category);

                                document
                                    .getElementById("products")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    });
                            }}
                            className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
                        >

                            <h3 className="text-xl font-bold text-gray-900">
                                {category}
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                {
                                    products.filter(
                                        (item) =>
                                            item.category === category
                                    ).length
                                }{" "}
                                Products
                            </p>

                            <p className="mt-4 text-sm font-semibold text-gray-900 opacity-0 transition group-hover:opacity-100">
                                Explore →
                            </p>

                        </button>

                    ))}

                </div>

            </section>


            {/* =================================
                TRENDING PRODUCTS
            ================================= */}

            <section className="bg-white py-14">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="mb-8 flex items-end justify-between">

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                                Discover
                            </p>

                            <h2 className="mt-1 text-3xl font-bold text-gray-900 md:text-4xl">
                                Trending Products
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Our most popular products right now
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("products")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                            className="hidden rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-black hover:text-black sm:block"
                        >
                            View All
                        </button>

                    </div>


                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">

                        {trendingProducts.map((product) => {

                            const remainingStock =
                                getRemainingStock(product);

                            const added =
                                isProductInCart(product.id);

                            return (

                                <div
                                    key={product.id}
                                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    {/* IMAGE */}

                                    <div className="relative h-48 overflow-hidden bg-gray-100 sm:h-56">

                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                        />

                                        <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white shadow">
                                            🔥 Trending
                                        </div>

                                        <div className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow">
                                            ⭐ {product.rating}
                                        </div>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="p-4 sm:p-5">

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            {product.category}
                                        </p>

                                        <h3 className="mt-1 line-clamp-1 text-base font-bold text-gray-900 sm:text-lg">
                                            {product.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                            {product.description}
                                        </p>


                                        {/* PRICE + STOCK */}

                                        <div className="mt-4 flex items-center justify-between">

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Price
                                                </p>

                                                <span className="text-lg font-bold text-gray-900 sm:text-xl">
                                                    ₹{product.price}
                                                </span>
                                            </div>

                                            <span
                                                className={`text-xs font-medium ${remainingStock > 0
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                {remainingStock > 0
                                                    ? `${remainingStock} left`
                                                    : "Out of stock"}
                                            </span>

                                        </div>


                                        {/* ADD TO CART */}

                                        <button
                                            disabled={
                                                remainingStock === 0 &&
                                                !added
                                            }
                                            onClick={() =>
                                                handleCartClick(product)
                                            }
                                            className={`mt-4 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] ${added
                                                ? "border border-green-600 bg-green-50 text-green-600 hover:bg-green-100"
                                                : remainingStock === 0
                                                    ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                                    : "bg-black text-white hover:bg-gray-800"
                                                }`}
                                        >
                                            {added
                                                ? "✓ Added to Cart"
                                                : remainingStock === 0
                                                    ? "Out of Stock"
                                                    : "Add to Cart"}
                                        </button>


                                        {/* BUY NOW */}

                                        <button
                                            disabled={remainingStock === 0}
                                            onClick={() =>
                                                handleBuyNow(product)
                                            }
                                            className={`mt-2 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] ${remainingStock === 0
                                                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                                : "bg-green-600 text-white hover:bg-green-700"
                                                }`}
                                        >
                                            {remainingStock === 0
                                                ? "Out of Stock"
                                                : `Buy Now • ₹${product.price}`}
                                        </button>

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                </div>

            </section>


            {/* =================================
                BRANDS
            ================================= */}

            <section className="mx-auto max-w-7xl px-6 py-12">

                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                        Collections
                    </p>

                    <h2 className="mt-1 text-3xl font-bold text-gray-900">
                        Popular Brands
                    </h2>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-3">

                    {brands.map((brand) => (

                        <button
                            key={brand}
                            onClick={() =>
                                navigate(
                                    `/brand/${encodeURIComponent(
                                        brand
                                    )}`
                                )
                            }
                            className="min-w-[150px] rounded-2xl border border-gray-200 bg-white px-6 py-6 text-center font-bold text-gray-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-black hover:shadow-lg"
                        >
                            {brand}

                            <span className="mt-2 block text-xs font-normal text-gray-400">
                                View Products →
                            </span>

                        </button>

                    ))}

                </div>

            </section>


            {/* =================================
                ALL PRODUCTS
            ================================= */}

            <section
                id="products"
                className="bg-gray-50 py-14"
            >
                <div className="mx-auto max-w-7xl px-6">

                    {/* ================= HEADER ================= */}

                    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                                Our Collection
                            </p>

                            <h2 className="mt-1 text-3xl font-bold text-gray-900 md:text-4xl">
                                All Products
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Find something you love from our collection
                            </p>
                        </div>

                        <div className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm">
                            {productsArr.length} Products
                        </div>

                    </div>


                    {/* ================= FILTER ================= */}

                    <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                        <Filter
                            products={products}
                            setFilter={setFilter}
                            searchValue={searchValue}
                            filter={filter}
                        />

                    </div>


                    {/* ================= PRODUCTS ================= */}

                    {productsArr.length > 0 ? (

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">

                            {productsArr.map((product) => {

                                const remainingStock =
                                    getRemainingStock(product);

                                const added =
                                    isProductInCart(product.id);

                                return (

                                    <div
                                        key={product.id}
                                        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >

                                        {/* ================= IMAGE ================= */}

                                        <div className="relative h-48 overflow-hidden bg-gray-100 sm:h-56">

                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                            />

                                            {/* Category */}

                                            <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white shadow">
                                                {product.category}
                                            </div>

                                            {/* Rating */}

                                            <div className="absolute right-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 shadow">
                                                ⭐ {product.rating}
                                            </div>

                                        </div>


                                        {/* ================= DETAILS ================= */}

                                        <div className="p-4 sm:p-5">

                                            {/* Category */}

                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                {product.category}
                                            </p>

                                            {/* Title */}

                                            <h3 className="mt-1 line-clamp-1 text-base font-bold text-gray-900 sm:text-lg">
                                                {product.title}
                                            </h3>

                                            {/* Description */}

                                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-500 sm:text-sm">
                                                {product.description}
                                            </p>


                                            {/* ================= PRICE + STOCK ================= */}

                                            <div className="mt-4 flex items-center justify-between">

                                                <div>

                                                    <p className="text-xs text-gray-400">
                                                        Price
                                                    </p>

                                                    <span className="text-lg font-bold text-gray-900 sm:text-xl">
                                                        ₹{product.price}
                                                    </span>

                                                </div>

                                                <span
                                                    className={`text-xs font-medium ${remainingStock > 0
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                        }`}
                                                >
                                                    {remainingStock > 0
                                                        ? `${remainingStock} left`
                                                        : "Out of stock"}
                                                </span>

                                            </div>


                                            {/* ================= ADD TO CART ================= */}

                                            <button
                                                disabled={
                                                    remainingStock === 0 &&
                                                    !added
                                                }
                                                onClick={() =>
                                                    handleCartClick(product)
                                                }
                                                className={`mt-4 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] ${added
                                                    ? "border border-green-600 bg-green-50 text-green-600 hover:bg-green-100"
                                                    : remainingStock === 0
                                                        ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                                        : "bg-black text-white hover:bg-gray-800"
                                                    }`}
                                            >
                                                {added
                                                    ? "✓ Added to Cart"
                                                    : remainingStock === 0
                                                        ? "Out of Stock"
                                                        : "Add to Cart"}
                                            </button>


                                            {/* ================= BUY NOW ================= */}

                                            <button
                                                disabled={remainingStock === 0}
                                                onClick={() =>
                                                    handleBuyNow(product)
                                                }
                                                className={`mt-2 flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] ${remainingStock === 0
                                                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                                    : "bg-green-600 text-white hover:bg-green-700"
                                                    }`}
                                            >
                                                {remainingStock === 0
                                                    ? "Out of Stock"
                                                    : `Buy Now • ₹${product.price}`}
                                            </button>

                                        </div>

                                    </div>

                                );
                            })}

                        </div>

                    ) : (

                        /* ================= EMPTY ================= */

                        <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                                🔍
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-gray-800">
                                No Products Found
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Try another search or category.
                            </p>

                        </div>

                    )}

                </div>
            </section>

        </div>
    );
}

export default Homepage;