import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CartsPageProvider from "./context/CartsPageProvider.jsx"

import Homepage from "./pages/Homepage";
import SIngleProduct from "./pages/SIngleProduct";
import Carts from "./pages/Carts";
import Navbar from "./components/Navbar";
import BrandProducts from "./pages/BrandPage"
import ScrollToTop from "./components/ScrollToTop"
import MyOrders from "./pages/MyOrders.jsx";

import { products } from "./data.js";

function App() {
  const [searchValue, setSearchValue] = useState("");


  return (
    <CartsPageProvider>


      <BrowserRouter>
        <ScrollToTop />
        <Navbar
          products={products}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Homepage
                products={products}
                searchValue={searchValue}

              />
            }
          />

          <Route
            path="/product"
            element={
              <SIngleProduct
                products={products}
                searchValue={searchValue}
              />
            }
          />

          <Route path="/carts" element={<Carts />} />
          <Route
            path="/brand/:brandName"
            element={<BrandProducts products={products} />}
          />
          <Route
            path="/myorders"
            element={<MyOrders />}
          />
        </Routes>

      </BrowserRouter>
    </CartsPageProvider>
  );
}

export default App;