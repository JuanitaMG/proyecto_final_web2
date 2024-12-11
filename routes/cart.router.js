import express from 'express';
export const cartRouter = express.Router();

// Ruta para agregar un producto al carrito
cartRouter.post('/add', (req, res) => {
    const { productId } = req.body;

    if (!req.session) {
        return res.status(500).json({ error: 'Session is not initialized' });
    }

    if (!req.session.cart) {
        req.session.cart = {};
    }

    // Incrementar la cantidad del producto en el carrito
    if (req.session.cart[productId]) {
        req.session.cart[productId] += 1;
    } else {
        req.session.cart[productId] = 1;
    }

    console.log(`Product ID ${productId} added to cart.`);
    console.log("Current cart:", req.session.cart);

    res.render('cart', { 
        message: "Producto agregado al carrito",
        cart: req.session.cart
    });
});

// Ruta para mostrar el carrito
cartRouter.get("/", (req, res) => {
    if (!req.session) {
        return res.status(500).json({ error: 'Session is not initialized' });
    }

    const cart = req.session.cart || {};
    res.render('cart', { 
        message: "Contenido del carrito",
        cart
    });
});
