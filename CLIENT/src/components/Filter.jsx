import React, { useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";

function Filter({ products, setFilter, searchValue, filter }) {
    const categories = products
        .map((product) => product.category)
        .filter((category, index, arr) => arr.indexOf(category) === index);

    useEffect(() => {
        if (searchValue) {
            setFilter("All");
        }
    }, [searchValue]);

    return (
        <div className="mb-8 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm">

            {/* Filter Title */}
            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                    <SlidersHorizontal size={18} />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                        Filter Products
                    </h3>
                    <p className="text-xs text-gray-500">
                        Choose a category
                    </p>
                </div>
            </div>

            {/* Select */}
            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 outline-none transition hover:bg-gray-100 focus:border-gray-400"
            >
                <option value="All">All Products</option>

                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Filter;