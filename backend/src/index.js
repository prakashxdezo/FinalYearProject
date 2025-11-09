require("dotenv").config();
const express = require("express");
const connectDB = require("./db/db");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8081;

app.use(cors())

// middleware
app.use(bodyParser.json());

// routes
const adminRoutes = require("./routers/AdminRoutes.js");
const sellerRouters = require("./routers/SellerRoutes.js");
const authRouters=require("./routers/AuthRoutes.js");
const userRouters=require("./routers/userRoutes.js");

const sellerProductRoutes=require("./routers/sellerProductRoutes.js");
const productRoutes=require("./routers/ProductRoutes.js");

const cartRoutes=require("./routers/CartRoutes.js");

const orderRoutes = require("./routers/OrderRoutes.js");
const sellerOrderRoutes=require("./routers/sellerOrderRoutes.js");

const paymentRoutes = require("./routers/PaymentRoutes.js");
const sellerReportRoutes = require("./routers/SellerReportRoutes.js");
const transactionRoutes = require("./routers/TransactionRoutes.js");

const homeCategoryRoutes = require("./routers/HomeCategoryRoutes.js");
const couponRoutes = require("./routers/CouponRoutes.js");
const dealRoutes=require("./routers/DealRoutes.js");
const wishlistRoutes = require("./routers/WishlistRoutes.js");

app.use("/auth",authRouters);
app.use("/api/users", userRouters)
app.use("/sellers", sellerRouters);

app.use("/products", productRoutes);
app.use("/api/sellers/products", sellerProductRoutes);

app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/seller/orders", sellerOrderRoutes)

app.use("/api/payment", paymentRoutes);

app.use("/api/seller/report", sellerReportRoutes);
app.use("/api/transactions", transactionRoutes);

app.use("/admin", adminRoutes);

app.use("/home", homeCategoryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/admin/deals", dealRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/wishlist", wishlistRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, "127.0.0.1", () => {
      console.log(`Server running on http://127.0.0.1:${port}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
  }
};

startServer();
