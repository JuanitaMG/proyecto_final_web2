import express from "express";
import { index, create, update, destroy, getProductsGroupedByCategory } from "../services/products.service.js";

export const productsViewsRouter = express.Router();

// Ruta pública para mostrar categorías de productos
productsViewsRouter.get("/", async (req, res) => {
    try {
        const categories = await getProductsGroupedByCategory();
        res.render("home", { categories, user: req.user || null });
    } catch (error) {
        console.error("Error in GET /:", error.message);
        res.status(500).send("Error loading the home page.");
    }
});

// Middleware para proteger las rutas
productsViewsRouter.use((req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
});

// Ruta protegida para listar productos
productsViewsRouter.get("/list", async (req, res) => {
    try {
        const products = await index(); // Asegúrate de que esta función obtenga correctamente los productos desde la base de datos
        res.render("index", {
            products: products,  // Pasa el objeto Products a la vista
            user: req.user      // Pasa el usuario autenticado, si es necesario
        });
    } catch (error) {
        console.error("Error in GET /list:", error.message);
        res.status(500).send("Error loading products.");
    }
});

// Ruta para crear un nuevo products
productsViewsRouter.post("/", async (req, res) => {
    try {
        const { name, done, brand, price, category, description, imagePath } = req.body;
        const isDone = done === "on";
        await create({ name, done: isDone, brand, price, category, description, imagePath });
        res.redirect("/products/list"); // Cambiar aquí
    } catch (error) {
        console.error("Error in POST /products:", error.message);
        res.status(500).send("Error creating product.");
    }
});


// Ruta para editar un producto
productsViewsRouter.post("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, done, brand, price, category, description, imagePath } = req.body;
        const isDone = done === "on";
        const updatedProduct = await update(id, { name, done: isDone, brand, price, category, description, imagePath });
        if (!updatedProduct) {
            return res.status(404).send("El producto no ha sido encontrado.");
        }
        res.redirect("/products/list");
    } catch (error) {
        console.error("Error en POST /edit/:id:", error.message);
        res.status(500).send("Error al editar el producto.");
    }
});


// Ruta para eliminar un product
productsViewsRouter.post("/destroy/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await destroy(id);
        res.redirect("/products/list"); 
    } catch (error) {
        console.error("Error in POST /destroy/:id:", error.message);
        res.status(500).send("Error deleting product.");
    }
});
