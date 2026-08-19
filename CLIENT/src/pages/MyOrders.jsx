import axios from "axios";
import React, { useEffect, useState } from "react";
import OrderSuccess from "../components/OrderSuccess"

function MyOrders() {
    const [myOrders, setMyOrders] = useState([]);
    const [orderPlace, setOrderPlace] = useState(false)
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER}/api/myorders`
            );

            console.log(response.data);

            // Agar backend se data array me aa raha hai
            setMyOrders(response.data.data || response.data);
            setOrderPlace(true);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-gray-500">Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                        Account
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-gray-900 md:text-4xl">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Check your recent orders and purchase details
                    </p>
                </div>

                {/* No Orders */}
                {myOrders.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                            📦
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-800">
                            No Orders Yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Your purchased products will appear here.
                        </p>

                    </div>
                ) : (

                    /* Orders */
                    <div className="space-y-6">

                        {myOrders.map((order) => {

                            // First product
                            const product = order.products?.[0];

                            return (
                                <div
                                    key={order._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                >

                                    {/* Order Header */}
                                    <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div>
                                            <p className="text-xs text-gray-400">
                                                Order ID
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-gray-800">
                                                #{order._id}
                                            </p>
                                        </div>

                                        <div className="rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-600">
                                            ✓ Order Placed
                                        </div>

                                    </div>


                                    {/* Product */}
                                    {/* Product */}
                                    <div className="p-5">

                                        {order.products?.map((product) => (

                                            <div
                                                key={product._id || product.productId}
                                                className="mb-5 flex flex-col gap-5 border-b border-gray-100 pb-5 last:mb-0 last:border-0 last:pb-0 sm:flex-row sm:items-center"
                                            >

                                                {/* Product Icon */}
                                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-4xl">
                                                    📦
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1">

                                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                        {product.category}
                                                    </p>

                                                    <h2 className="mt-1 text-lg font-bold text-gray-900">
                                                        {product.title}
                                                    </h2>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Brand:{" "}
                                                        <span className="font-medium text-gray-700">
                                                            {product.brand}
                                                        </span>
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-2">

                                                        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                            Qty: {product.quantity}
                                                        </span>

                                                        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                                            ₹{product.price} / item
                                                        </span>

                                                    </div>

                                                </div>

                                                {/* Product Total */}
                                                <div className="sm:text-right">

                                                    <p className="text-xs text-gray-400">
                                                        Product Total
                                                    </p>

                                                    <p className="mt-1 text-xl font-bold text-gray-900">
                                                        ₹{product.price * product.quantity}
                                                    </p>

                                                </div>

                                            </div>

                                        ))}

                                    </div>


                                    {/* Footer */}
                                    <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                                        <p className="text-xs text-gray-500">
                                            Ordered on{" "}
                                            <span className="font-medium text-gray-700">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </p>

                                        <p className="text-sm font-semibold text-gray-700">
                                            {order.totalItems}{" "}
                                            {order.totalItems === 1
                                                ? "Item"
                                                : "Items"}
                                        </p>

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

export default MyOrders;