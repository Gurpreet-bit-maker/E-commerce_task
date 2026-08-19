import express from "express";
const app = express();
app.use(express.json(0));
app.use(express.urlencoded({ extended: true }));
import cors from "cors";

import connectDB from "./lib.js";
import Order from "./productModel.js";
connectDB();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
//? Routes
//*buy order route
app.post("/api/orders", async (req, res) => {
  try {
    const { products, totalItems, totalPrice } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Products are required",
      });
    }

    if (!totalItems || totalPrice === undefined) {
      return res.status(400).json({
        message: "Total items and total price are required",
      });
    }

    const createdOrder = await Order.create({
      products: products.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity || 1),
        brand: item.brand,
        category: item.category,
      })),

      totalItems: Number(totalItems),

      totalPrice: Number(totalPrice),
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.log("Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while placing order",
      error: error.message,
    });
  }
});
app.get("/api/myorders", async (req, res) => {
  try {
    const orders = await Order.find();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
});

app.listen(8080, () => {
  console.log("listing port on 8080");
});
