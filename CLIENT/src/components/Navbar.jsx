import React, { useContext, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    ShoppingCart,
    Search,
    Menu,
    X,
    Package
} from "lucide-react";

import { CartsContext } from "../context/CartsPageProvider.jsx";

function Navbar({
    products,
    searchValue,
    setSearchValue,
}) {
    const { cartProducts } = useContext(CartsContext);

    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Search products
    const searchProducts = useMemo(() => {
        if (!searchValue.trim()) return [];

        return products
            .filter((product) =>
                product.title
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())
            )
            .slice(0, 5);
    }, [searchValue, products]);

    // Product click
    const handleProductClick = (product) => {
        setSearchValue("");

        navigate("/product", {
            state: {
                item: product,
            },
        });
    };

    // Total cart quantity
    const cartCount = cartProducts.reduce(
        (total, item) => total + (item.quantity || 1),
        0
    );

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Logo */}
                <NavLink
                    to="/"
                    className="shrink-0 text-2xl font-extrabold tracking-tight text-gray-900"
                >
                    Slekco
                </NavLink>

                {/* Home */}
                <NavLink
                    to="/"
                    className="ml-8 hidden text-sm font-medium text-gray-600 hover:text-black md:block"
                >
                    Home
                </NavLink>

                {/* Desktop Search */}
                <div className="relative ml-auto hidden w-full max-w-md md:block">

                    <Search
                        size={19}
                        className="absolute left-3 top-3 text-gray-400"
                    />

                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) =>
                            setSearchValue(e.target.value)
                        }
                        placeholder="Search products..."
                        className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                    />

                    {/* Search Suggestions */}
                    {searchValue && (
                        <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">

                            {searchProducts.length > 0 ? (
                                searchProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        onClick={() =>
                                            handleProductClick(product)
                                        }
                                        className="flex w-full items-center gap-3 border-b border-gray-100 p-3 text-left transition last:border-0 hover:bg-gray-50"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="h-10 w-10 rounded-lg object-cover"
                                        />

                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {product.title}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                ₹{product.price}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-500">
                                    No products found
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side */}
                <div className="ml-3 flex items-center gap-1 sm:ml-6 sm:gap-3">

                    {/* My Orders */}
                    <button
                        onClick={() => navigate("/myorders")}
                        title="My Orders"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 hover:text-black"
                    >
                        <Package size={22} />
                    </button>

                    {/* Cart */}
                    <NavLink
                        to="/carts"
                        title="Cart"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
                    >
                        <ShoppingCart size={22} />

                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                                {cartCount}
                            </span>
                        )}
                    </NavLink>

                    {/* Mobile Menu */}
                    <button
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 md:hidden"
                    >
                        {menuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">

                    <NavLink
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Home
                    </NavLink>

                    {/* Mobile Search */}
                    <div className="relative mt-3">

                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />

                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) =>
                                setSearchValue(e.target.value)
                            }
                            placeholder="Search products..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gray-400"
                        />

                        {searchValue && (
                            <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

                                {searchProducts.length > 0 ? (
                                    searchProducts.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                handleProductClick(product);
                                                setMenuOpen(false);
                                            }}
                                            className="flex w-full items-center gap-3 border-b border-gray-100 p-3 text-left last:border-0 hover:bg-gray-50"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="h-10 w-10 rounded-lg object-cover"
                                            />

                                            <div>
                                                <p className="text-sm font-semibold">
                                                    {product.title}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    ₹{product.price}
                                                </p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="p-4 text-center text-sm text-gray-500">
                                        No products found
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;