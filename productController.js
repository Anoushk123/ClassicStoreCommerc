const axios = require('axios');
const Product = require('../models/Product');

// Fetch and sync products from Fake Store API
exports.syncProducts = async (req, res, next) => {
    try {
        const response = await axios.get('https://fakestoreapi.com/products');
        const fakeStoreProducts = response.data;

        // Save to database
        for (const product of fakeStoreProducts) {
            await Product.findOneAndUpdate(
                { fakeStoreId: product.id },
                {
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    category: product.category,
                    image: product.image,
                    fakeStoreId: product.id
                },
                { upsert: true, new: true }
            );
        }

        res.json({ message: 'Products synced successfully', count: fakeStoreProducts.length });
    } catch (error) {
        next(error);
    }
};

// Get all products
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        next(error);
    }
};

// Add new product
exports.addProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

// Update product
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};