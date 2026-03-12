import { Router } from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const router = Router();

// Crear carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });

        res.status(201).json({
            status: "success",
            payload: newCart
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

// Obtener carrito por id con populate
router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid).populate("products.product").lean();

        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Carrito no encontrado"
            });
        }

        res.json({
            status: "success",
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Carrito no encontrado"
            });
        }

        const product = await Product.findById(pid);
        if (!product) {
            return res.status(404).json({
                status: "error",
                error: "Producto no encontrado"
            });
        }

        const existingProduct = cart.products.find(
            item => item.product.toString() === pid
        );

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }

        await cart.save();

        const acceptHeader = req.headers.accept || "";

        if (acceptHeader.includes("text/html")) {
            return res.redirect(`/carts/${cid}`);
        }

        res.json({
            status: "success",
            message: "Producto agregado al carrito",
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Carrito no encontrado"
            });
        }

        cart.products = cart.products.filter(
            item => item.product.toString() !== pid
        );

        await cart.save();

        res.json({
            status: "success",
            message: "Producto eliminado del carrito",
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Carrito no encontrado"
            });
        }

        cart.products = [];
        await cart.save();

        res.json({
            status: "success",
            message: "Carrito vaciado",
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Carrito no encontrado"
            });
        }

        if (!Array.isArray(products)) {
            return res.status(400).json({
                status: "error",
                error: "El campo products debe ser un arreglo"
            });
        }

        cart.products = products;
        await cart.save();

        res.json({
            status: "success",
            message: "Carrito actualizado",
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: "error",
                error: "Carrito no encontrado"
            });
        }

        const productInCart = cart.products.find(
            item => item.product.toString() === pid
        );

        if (!productInCart) {
            return res.status(404).json({
                status: "error",
                error: "Producto no encontrado en el carrito"
            });
        }

        productInCart.quantity = quantity;
        await cart.save();

        res.json({
            status: "success",
            message: "Cantidad actualizada",
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});


export default router;