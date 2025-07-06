const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const checkoutRouter = require("./routes/checkout");
const { handleMalformedJson, formatCelebrateErrors } = require("./middlewares/handleError");

const app = express();

// mongodb
const mongoUrl = process.env.MONGO_URL || process.env.DB_URL;
console.log("Environment check:");
console.log("- MONGO_URL exists:", !!process.env.MONGO_URL);
console.log("- DB_URL exists:", !!process.env.DB_URL);
console.log("- Using URL:", mongoUrl ? "YES" : "NO");

if (!mongoUrl) {
  console.error("❌ No MongoDB connection string found in environment variables!");
  process.exit(1);
}

mongoose
  .connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
    console.log("Database name:", mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// global middlewares
app.use(cors());
app.use(express.json());
app.use(handleMalformedJson); // handle common req errors

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
app.use("/checkout", checkoutRouter);
const productRoutes = require("./routes/product");
app.use("/api/products", productRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", orderRouter); // ✅ mount chuẩn cho FE gọi
const userApiRouter = require("./routes/user");

app.use("/api/users", userApiRouter);
// thiếu:

// server status
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// format celebrate paramater validation errors
app.use(formatCelebrateErrors);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT || 5000}`);
});
