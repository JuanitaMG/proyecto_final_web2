import express from "express";
import { productsFileRouter } from "./products.file.router.js";
import { productsRouter } from "./products.router.js";
import { productsViewsRouter } from "./products.views.router.js";
import { authRouter } from "./auth.router.js";

export function routerProducts(app) {
    // Rutas de autenticación
    app.use("/auth", authRouter);

    // Rutas de vistas de productos 
    app.use("/products", productsViewsRouter);

    // API para gestionar productos
    const apiRouter = express.Router();
    apiRouter.use("/file/products", productsFileRouter);
    apiRouter.use("/products", productsRouter);

    app.use("/api/v1", apiRouter);

    // Ruta base para vistas generales
    app.use("/", productsViewsRouter);
}
