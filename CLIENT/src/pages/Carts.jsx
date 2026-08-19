import React, { useContext, useState } from "react";
import {
    Trash2,
    Minus,
    Plus,
    ShoppingBag,
} from "lucide-react";
import axios from "axios";

import { CartsContext } from "../context/CartsPageProvider";
import OrderSuccess from "../components/OrderSuccess";

function Carts() {
    const {
        cartProducts,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useContext(CartsContext);

    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);

    // =================================
    // TOTAL PRICE
    // =================================

    const totalPrice = cartProducts.reduce(
        (total, item) =>
            total + item.price * (item.quantity || 1),
        0
    );

    // =================================
    // TOTAL ITEMS
    // =================================

    const totalItems = cartProducts.reduce(
        (total, item) =>
            total + (item.quantity || 1),
        0
    );

    // =================================
    // BUY ALL CART PRODUCTS
    // =================================

    const handleBuyAll = async () => {
        if (cartProducts.length === 0) {
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                products: cartProducts.map((item) => ({
                    productId: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity || 1,
                    brand: item.brand,
                    category: item.category,
                })),

                totalItems,
                totalPrice,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER}/api/orders`,
                orderData,
                {
                    withCredentials: true,
                }
            );

            console.log("Order Response:", response.data);

            // Order successfully stored
            setOrderPlaced(true);

            // Cart clear
            clearCart();

        } catch (error) {
            console.log(
                "Order Error:",
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                "Something went wrong while placing order"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        orderPlaced ? <OrderSuccess /> : <div className="min-h-screen bg-gray-100 px-4 py-8 md:px-10">

            <div className="mx-auto max-w-7xl">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="mb-8 flex items-center gap-3">

                    <div className="rounded-xl bg-black p-3 text-white">
                        <ShoppingBag size={24} />
                    </div>

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Your Cart
                        </h1>

                        <p className="text-sm text-gray-500">
                            {totalItems}{" "}
                            {totalItems === 1
                                ? "item"
                                : "items"}{" "}
                            in your cart
                        </p>

                    </div>

                </div>


                {/* =================================
                    EMPTY CART
                ================================= */}

                {cartProducts.length === 0 ? (

                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white shadow-sm">

                        <ShoppingBag
                            size={70}
                            className="mb-4 text-gray-300"
                        />

                        <h2 className="text-2xl font-semibold text-gray-800">
                            Your cart is empty
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Add some products to your cart.
                        </p>

                        <button
                            onClick={() =>
                                window.location.href = "/"
                            }
                            className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                        >
                            Continue Shopping
                        </button>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* =================================
                            CART PRODUCTS
                        ================================= */}

                        <div className="space-y-4 lg:col-span-2">

                            {cartProducts.map((item) => (

                                <div
                                    key={item.id}
                                    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
                                >

                                    {/* IMAGE */}

                                    <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-gray-100 sm:h-28 sm:w-28">

                                        {item.image ? (

                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="h-full w-full rounded-xl object-contain"
                                            />

                                        ) : (

                                            <ShoppingBag
                                                size={40}
                                                className="text-gray-300"
                                            />

                                        )}

                                    </div>


                                    {/* PRODUCT INFO */}

                                    <div className="flex-1">

                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {item.title}
                                        </h2>

                                        <p className="mt-1 text-lg font-bold text-black">
                                            ₹{item.price}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Price per item
                                        </p>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="flex items-center justify-between gap-4 sm:flex-col">

                                        <div className="flex items-center rounded-xl border border-gray-200">

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        "decrease"
                                                    )
                                                }
                                                className="p-2 transition hover:bg-gray-100"
                                            >
                                                <Minus size={16} />
                                            </button>

                                            <span className="w-10 text-center font-semibold">
                                                {item.quantity || 1}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        "increase"
                                                    )
                                                }
                                                className="p-2 transition hover:bg-gray-100"
                                            >
                                                <Plus size={16} />
                                            </button>

                                        </div>


                                        {/* REMOVE */}

                                        <button
                                            onClick={() =>
                                                removeFromCart(item.id)
                                            }
                                            className="flex items-center gap-1 text-sm text-red-500 transition hover:text-red-700"
                                        >
                                            <Trash2 size={17} />
                                            Remove
                                        </button>

                                    </div>


                                    {/* ITEM TOTAL */}

                                    <div className="text-right">

                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>

                                        <p className="text-xl font-bold text-gray-900">
                                            ₹
                                            {item.price *
                                                (item.quantity || 1)}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* =================================
                            ORDER SUMMARY
                        ================================= */}

                        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-5">

                            <h2 className="text-xl font-bold text-gray-900">
                                Order Summary
                            </h2>


                            <div className="my-5 border-t border-gray-100" />


                            <div className="space-y-4">

                                <div className="flex justify-between text-gray-600">
                                    <span>Items</span>
                                    <span>{totalItems}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery</span>

                                    <span className="font-medium text-green-600">
                                        FREE
                                    </span>

                                </div>

                            </div>


                            <div className="my-5 border-t border-gray-100" />


                            {/* FINAL TOTAL */}

                            <div className="flex justify-between">

                                <span className="text-lg font-semibold">
                                    Total
                                </span>

                                <span className="text-2xl font-bold">
                                    ₹{totalPrice}
                                </span>

                            </div>


                            {/* =================================
                                BUY ALL BUTTON
                            ================================= */}

                            <button
                                onClick={handleBuyAll}
                                disabled={loading}
                                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition active:scale-[0.98] ${loading
                                    ? "cursor-not-allowed bg-gray-400"
                                    : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >

                                <ShoppingBag size={19} />

                                {loading
                                    ? "Placing Order..."
                                    : `Buy All • ₹${totalPrice}`}

                            </button>


                            <p className="mt-4 text-center text-xs text-gray-400">
                                Secure checkout • Free delivery
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Carts;