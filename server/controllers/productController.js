const Product = require("../models/Product");

// Add Product
const addProduct = async (req, res) => {
  try {
    const {
      farmerId,
      productName,
      category,
      price,
      quantity,
      description,
    } = req.body;

    // Debug: Check if Multer receives the uploaded file
    console.log(req.file);

    const product = await Product.create({
      farmerId,
      productName,
      category,
      price,
      quantity,
      description,
      image: req.file ? req.file.filename : "",
    });

    res.status(201).json({
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Products by Farmer
const getMyProducts = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const products = await Product.find({ farmerId });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { returnDocument: "after" }
    );

    res.status(200).json({
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Export all functions (must be at the end)
module.exports = {
  addProduct,
  getMyProducts,
  getAllProducts,
  deleteProduct,
  updateProduct,
};