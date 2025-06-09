const express = require("express");
const Product = require("../models/Product");
const validateProduct = require("../middleware/validateProduct");
const NotFoundError = require("../errors/NotFoundError");

const router = express.Router();

// GET /api/products?category=&page=&limit=
router.get("/", async (req, res, next) => {
  try {
    let { category, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (category) filter.category = category;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ page, limit, total, data: products });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new NotFoundError("Product not found"));
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post("/", validateProduct, async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put("/:id", validateProduct, async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return next(new NotFoundError("Product not found"));
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new NotFoundError("Product not found"));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /api/products/search?q=
router.get("/search", async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const regex = new RegExp(q, "i"); // case-insensitive search
    const results = await Product.find({ name: regex });
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/stats
router.get("/stats", async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
