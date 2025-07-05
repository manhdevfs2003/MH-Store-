const router = require("express").Router();
const { celebrate } = require("celebrate");

const Product = require("../models/Product.model");
const { product: productSchema } = require("../models/schema");
const { verifyToken, verifyAuthorization, verifyAdminAccess } = require("../middlewares/verifyAuth");

const productResponse = {
  productAdded: {
    status: "ok",
    message: "product has been added",
  },
  productUpdated: {
    status: "ok",
    message: "product has been updated",
  },
  productDeleted: {
    status: "ok",
    message: "product has been deleted",
  },
  unexpectedError: {
    status: "error",
    message: "an unexpected error occurred",
  },
};

// ✅ Đặt trước /:id để tránh bị hiểu nhầm
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Missing search query" });

    const keywords = q.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const results = await Product.find({
      $and: keywords.map((kw) => ({
        $or: [{ title: { $regex: kw, $options: "i" } }, { description: { $regex: kw, $options: "i" } }, { categories: { $in: [kw] } }, { color: { $in: [kw] } }],
      })),
    });

    res.json(results);
  } catch (err) {
    console.error("❌ Lỗi thực tế:", err);
    res.status(500).json(productResponse.unexpectedError);
  }
});

// Get all products - any user
router.get("/", celebrate({ query: productSchema.query }), async (req, res) => {
  const query = req.query;
  try {
    let products;
    if (query.new) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (query.category) {
      products = await Product.find({
        categories: { $in: [query.category] },
      });
    } else {
      products = await Product.find();
    }
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

// Add a new product - admin only
router.post("/", verifyAdminAccess, celebrate({ body: productSchema.new }), async (req, res) => {
  try {
    await Product.create(req.body);
    return res.json(productResponse.productAdded);
  } catch (err) {
    console.log(err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

// Update a product - admin only
router.put("/:id", verifyAdminAccess, celebrate({ body: productSchema.update }), async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    return res.json(productResponse.productUpdated);
  } catch (err) {
    console.error("1");
    console.error(err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

// Delete a product - admin only
router.delete("/:id", verifyAdminAccess, async (req, res) => {
  console.log("🧨 Đang gọi API xoá với id:", req.params.id);
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json(productResponse.productDeleted);
  } catch (err) {
    console.log("❌ Lỗi BE khi xoá:", err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

// Get any product - any user
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json(productResponse.unexpectedError);
  }
});

module.exports = router;
