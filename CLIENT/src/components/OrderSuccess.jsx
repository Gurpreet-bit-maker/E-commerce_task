import React from "react";
import { CheckCircle, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-lg">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle
                        size={42}
                        className="text-green-600"
                    />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-gray-900">
                    Order Placed Successfully!
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    Thank you for your purchase. Your order has been
                    successfully placed.
                </p>

                <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                        <Package size={18} />
                        Your order is being processed
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    <button
                        onClick={() => navigate("/myorders")}
                        className="flex-1 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                        View My Orders
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>
        </div>
    );
}

export default OrderSuccess;