import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ShoppingBag } from "lucide-react";
import axios from "axios";
import { CartsContext } from "../context/CartsPageProvider.jsx";

function BrandProducts({ products }) {
    const { brandName } = useParams();
    const navigate = useNavigate();

    const {
        cartProducts,
        addToCart,
        removeFromCart,
    } = useContext(CartsContext);

    const brandProducts = products.filter(
        (item) => item.brand === brandName
    );

    // =================================
    // CHECK PRODUCT IN CART
    // =================================

    const isProductInCart = (id) => {
        return cartProducts.some(
            (item) => item.id === id
        );
    };

    // =================================
    // ADD / REMOVE CART
    // =================================

    const handleCartClick = (item) => {
        const alreadyInCart = isProductInCart(item.id);

        if (alreadyInCart) {
            removeFromCart(item.id);
        } else {
            addToCart(item);
        }
    };

    // =================================
    // BUY PRODUCT API
    // =================================

    //   handleBuy
    const handleBuy = (product) => {
        navigate("/product", {
            state: {
                item: product,
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

            <div className="mx-auto max-w-7xl">

                {/* =================================
                    BACK BUTTON
                ================================= */}

                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>


                {/* =================================
                    BRAND HEADER
                ================================= */}

                <div className="mb-10 rounded-2xl bg-black px-6 py-10 text-white md:px-10">

                    <p className="text-sm uppercase tracking-widest text-gray-400">
                        Brand Collection
                    </p>

                    <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                        {brandName}
                    </h1>

                    <p className="mt-3 text-gray-400">
                        Explore all products from {brandName}
                    </p>

                    <div className="mt-5 inline-block rounded-full bg-white/10 px-4 py-2 text-sm">
                        {brandProducts.length}{" "}
                        {brandProducts.length === 1
                            ? "Product"
                            : "Products"}
                    </div>

                </div>


                {/* =================================
                    NO PRODUCTS
                ================================= */}

                {brandProducts.length === 0 ? (

                    <div className="rounded-2xl bg-white py-20 text-center shadow-sm">

                        <h2 className="text-2xl font-semibold text-gray-800">
                            No products found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            This brand currently has no products.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                        >
                            Continue Shopping
                        </button>

                    </div>

                ) : (

                    /* =================================
                        PRODUCTS
                    ================================= */

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

                        {brandProducts.map((item) => {

                            const added = isProductInCart(item.id);

                            return (

                                <div
                                    key={item.id}
                                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    {/* =================================
                                        IMAGE
                                    ================================= */}

                                    <div className="relative h-56 overflow-hidden bg-gray-100">

                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />

                                        {/* Rating */}

                                        <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">
                                            ⭐ {item.rating}
                                        </div>

                                        {/* Brand */}

                                        <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white shadow">
                                            {item.brand}
                                        </div>

                                    </div>


                                    {/* =================================
                                        PRODUCT INFO
                                    ================================= */}

                                    <div className="p-5">

                                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                            {item.category}
                                        </p>

                                        <h2 className="mt-1 line-clamp-1 text-lg font-bold text-gray-900">
                                            {item.title}
                                        </h2>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                                            {item.description}
                                        </p>


                                        {/* PRICE */}

                                        <div className="mt-4 flex items-center justify-between">

                                            <span className="text-xl font-bold text-gray-900">
                                                ₹{item.price}
                                            </span>

                                            <span
                                                className={`text-xs font-medium ${item.stock > 0
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                {item.stock > 0
                                                    ? `${item.stock} in stock`
                                                    : "Out of stock"}
                                            </span>

                                        </div>


                                        {/* =================================
                                            BUTTONS
                                        ================================= */}

                                        <div className="mt-5 space-y-2">

                                            {/* CART BUTTON */}

                                            <button
                                                disabled={
                                                    item.stock === 0 &&
                                                    !added
                                                }
                                                onClick={() =>
                                                    handleCartClick(item)
                                                }
                                                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-semibold transition active:scale-[0.98] ${added
                                                    ? "border border-green-600 bg-green-50 text-green-600 hover:bg-green-100"
                                                    : item.stock === 0
                                                        ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                                        : "bg-black text-white hover:bg-gray-800"
                                                    }`}
                                            >

                                                <ShoppingCart size={17} />

                                                {added
                                                    ? "✓ Added to Cart"
                                                    : item.stock === 0
                                                        ? "Out of Stock"
                                                        : "Add to Cart"}

                                            </button>


                                            {/* BUY BUTTON */}

                                            <button
                                                disabled={item.stock === 0}
                                                onClick={() =>
                                                    handleBuy(item)
                                                }
                                                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-semibold transition active:scale-[0.98] ${item.stock === 0
                                                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                                                    : "bg-green-600 text-white hover:bg-green-700"
                                                    }`}
                                            >

                                                <ShoppingBag size={17} />

                                                {item.stock === 0
                                                    ? "Out of Stock"
                                                    : "Buy Now"}

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
}

export default BrandProducts;