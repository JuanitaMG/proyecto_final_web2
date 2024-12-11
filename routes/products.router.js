import express from "express";
export const productsRouter = express.Router();

import { index, create, show, update, destroy } from "../services/products.service.js";
import { createProductSchema, getProductSchema, updateProductSchema } from "../schemas/products.schema.js";
import { validatorHandler } from "../middleware/validator.handler.js";

// Cambiado `productsRouterRouter` a `productsRouter`
productsRouter.get("/", async (req, res) => {
    try {
        const products = await index(); 
        res.render("index", { products, user: req.user || null }); 
    } catch (error) {
        console.error("Error en GET /:", error.message);
        res.status(500).send("Error al cargar los productos.");
    }
});

productsRouter.post(
    '/',
    validatorHandler(createProductSchema, 'body'),
    async (req, res) => {
        try {
            const product = req.body;
            const newProduct = await create(product);
            console.log('POST /api/v1/products');
            res.status(201).json({ success: true, data: newProduct });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);

productsRouter.get('/:id', 
    validatorHandler(getProductSchema, 'params'),
    async (req, res) => {
        try {
            const id = req.params.id;
            const product = await show(id);
            console.log(`GET /api/v1/products/${id}`);
            if (!product) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }
            res.status(200).json({ success: true, data: product });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);

productsRouter.put('/:id', 
    validatorHandler(getProductSchema, 'params'),
    validatorHandler(updateProductSchema, 'body'),
    async (req, res) => {
        try {
            const id = req.params.id;
            const product = req.body;
            const updatedProduct = await update(id, product);
            console.log(`PUT /api/v1/products/${id}`);
            if (!updatedProduct) {
                return res.status(404).json({ success: false, error: 'Product not found' });
            }
            res.status(200).json({ success: true, data: updatedProduct });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);

productsRouter.delete('/:id',
    validatorHandler(getProductSchema, 'params'),
    async (req, res) => {
        try {
            const id = req.params.id;
            const product = await destroy(id);
            console.log(`DELETE /api/v1/products/${id}`);
            if (!product) {
                return res.status(404).json({ success: false, error: 'Product not found', deleted: false });
            }
            res.status(200).json({ success: true, data: product, deleted: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
);
