require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const logger = require("./middleware/logger");
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const productsRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/productdb";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware
app.use(bodyParser.json());
app.use(logger);
// app.use(auth);

// Root route
app.get("/", (req, res) => {
  res.send("Hello World! Welcome to the Product API.");
});

// Products routes
app.use("/api/products", productsRoutes);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
