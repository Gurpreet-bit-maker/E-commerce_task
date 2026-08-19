import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { CartsContext } from "../context/CartsPageProvider.jsx";

function SIngleProduct({ products, searchValue }) {
    const location = useLocation();
    const itemDetails = location.state?.item;

    const {
        cartProducts,
        addToCart,
        removeFromCart,
    } = useContext(CartsContext);

    const [quantity, setQuantity] = useState(1);
    const [isActiveCartBtn, setIsActiveCartBtn] = useState(false);

    // Check product already exists in Context cart
    useEffect(() => {
        if (!itemDetails) return;

        const existingItem = cartProducts.find(
            (item) => item.id === itemDetails.id
        );

        if (existingItem) {
            setIsActiveCartBtn(true);
            setQuantity(existingItem.quantity || 1);
        } else {
            setIsActiveCartBtn(false);
            setQuantity(1);
        }
    }, [itemDetails, cartProducts]);

    // Buy API
    const buyNow = async () => {
        try {
            const orderData = {
                products: [
                    {
                        productId: itemDetails.id,
                        title: itemDetails.title,
                        price: itemDetails.price,
                        quantity: quantity,
                        brand: itemDetails.brand,
                        category: itemDetails.category,
                    },
                ],

                totalItems: quantity,

                totalPrice: Number(
                    itemDetails.price * quantity
                ),
            };

            console.log("Single Order Data:", orderData);

            const res = await axios.post(
                "http://localhost:8080/api/orders",
                orderData,
                {
                    withCredentials: true,
                }
            );

            console.log("Single Order Response:", res.data);

            if (res.data.order) {
                alert("Order placed successfully!");
            } else {
                alert("Order not placed");
            }

        } catch (error) {
            console.log(
                "Buy Now Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Something went wrong while placing order"
            );
        }
    };
    // Add / Remove Cart
    const handleCart = () => {
        if (isActiveCartBtn) {
            removeFromCart(itemDetails.id);
        } else {
            addToCart({
                ...itemDetails,
                quantity: quantity,
            });
        }
    };

    if (!itemDetails) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-500">
                    Product not found
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Product Card */}
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">

                    <div className="grid grid-cols-1 md:grid-cols-2">

                        {/* ================= IMAGE ================= */}

                        <div className="relative flex min-h-[400px] items-center justify-center bg-gray-100 p-6 md:min-h-[600px] md:p-10">

                            {/* Category Badge */}
                            <span className="absolute left-6 top-6 z-10 rounded-full bg-black px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow">
                                {itemDetails.category}
                            </span>

                            {/* Rating Badge */}
                            <span className="absolute right-6 top-6 z-10 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 shadow-sm">
                                ⭐ {itemDetails.rating}
                            </span>

                            <img
                                src={itemDetails.image}
                                alt={itemDetails.title}
                                className="h-[340px] w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.02] md:h-[500px]"
                            />

                        </div>


                        {/* ================= PRODUCT DETAILS ================= */}

                        <div className="flex flex-col p-6 md:p-10">

                            {/* Small Label */}
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                                Product Details
                            </p>


                            {/* Title */}
                            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                                {itemDetails.title}
                            </h1>


                            {/* Rating */}
                            <div className="mt-4 flex items-center gap-3">

                                <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1.5">
                                    <span className="text-yellow-500">
                                        ⭐
                                    </span>

                                    <span className="text-sm font-semibold text-gray-800">
                                        {itemDetails.rating}
                                    </span>
                                </div>

                                <span className="text-sm text-gray-400">
                                    Customer Rating
                                </span>

                            </div>


                            {/* Divider */}
                            <div className="my-6 border-t border-gray-100" />


                            {/* Price */}
                            <div>

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Price
                                </p>

                                <div className="mt-1 flex items-end gap-2">

                                    <h2 className="text-3xl font-bold text-gray-900">
                                        ₹{itemDetails.price}
                                    </h2>

                                    <span className="mb-1 text-sm text-gray-400">
                                        / item
                                    </span>

                                </div>

                            </div>


                            {/* Description */}
                            <div className="mt-6">

                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Description
                                </p>

                                <p className="mt-2 text-sm leading-7 text-gray-600 md:text-base">
                                    {itemDetails.description}
                                </p>

                            </div>


                            {/* Stock */}
                            <div className="mt-6">

                                {itemDetails.stock > 0 ? (

                                    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500" />

                                        <span className="text-sm font-semibold text-green-700">
                                            In Stock
                                        </span>

                                        <span className="text-sm text-green-600">
                                            • {itemDetails.stock} available
                                        </span>
                                    </div>

                                ) : (

                                    <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />

                                        <span className="text-sm font-semibold text-red-600">
                                            Out of Stock
                                        </span>
                                    </div>

                                )}

                            </div>


                            {/* Quantity */}
                            <div className="mt-7">

                                <p className="mb-3 text-sm font-semibold text-gray-800">
                                    Quantity
                                </p>

                                <div className="flex w-fit items-center overflow-hidden rounded-xl border border-gray-200 bg-white">

                                    <button
                                        disabled={itemDetails.stock === 0}
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                Math.max(1, prev - 1)
                                            )
                                        }
                                        className="flex h-11 w-11 items-center justify-center text-xl font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        −
                                    </button>

                                    <div className="flex h-11 w-12 items-center justify-center border-x border-gray-200 text-base font-bold text-gray-900">
                                        {quantity}
                                    </div>

                                    <button
                                        disabled={
                                            itemDetails.stock === 0 ||
                                            quantity >= itemDetails.stock
                                        }
                                        onClick={() =>
                                            setQuantity((prev) =>
                                                Math.min(
                                                    itemDetails.stock,
                                                    prev + 1
                                                )
                                            )
                                        }
                                        className="flex h-11 w-11 items-center justify-center text-xl font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        +
                                    </button>

                                </div>

                            </div>


                            {/* Total */}
                            <div className="mt-6 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-4">

                                <span className="text-sm font-medium text-gray-500">
                                    Total
                                </span>

                                <span className="text-xl font-bold text-gray-900">
                                    ₹{itemDetails.price * quantity}
                                </span>

                            </div>


                            {/* ================= BUTTONS ================= */}

                            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">

                                {/* Add To Cart */}

                                <button
                                    disabled={itemDetails.stock === 0}
                                    onClick={handleCart}
                                    className={
                                        isActiveCartBtn
                                            ? "flex-1 rounded-xl border border-green-600 bg-green-50 px-6 py-3.5 text-sm font-semibold text-green-600 transition hover:bg-green-100 active:scale-[0.98]"
                                            : "flex-1 rounded-xl bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
                                    }
                                >
                                    {isActiveCartBtn
                                        ? "✓ Added to Cart"
                                        : "Add to Cart"}
                                </button>


                                {/* Buy Now */}

                                <button
                                    disabled={itemDetails.stock === 0}
                                    onClick={buyNow}
                                    className="flex-1 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                                >
                                    {itemDetails.stock === 0
                                        ? "Out of Stock"
                                        : `Buy Now • ₹${itemDetails.price * quantity}`}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default SIngleProduct;