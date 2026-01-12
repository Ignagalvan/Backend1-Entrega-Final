import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const app = Router();


app.post("/", async (req, res) => {
    try {
        const newCart = await CartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.log("Error al crear carrito:", error);
        res.send("Error al crear carrito");
    }
});


app.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await CartManager.getCartsById(cid);

        if (!cart) {
            console.log("Carrito no encontrado:", cid);
            return res.send("Carrito no encontrado");
        }

        res.json(cart.products);
    } catch (error) {
        console.log("Error al obtener carrito:", error);
        res.send("Error al obtener carrito");
    }
});


app.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const product = await ProductManager.getProductById(pid);
        if (!product) {
            console.log("Producto no existe:", pid);
            return res.send("Producto no existe");
        }

        const updatedCart = await CartManager.addProductToCart(cid, pid);

        if (!updatedCart) {
            console.log("Carrito no encontrado:", cid);
            return res.send("Carrito no encontrado");
        }

        res.json(updatedCart);
    } catch (error) {
        console.log("Error al agregar producto al carrito:", error);
        res.send("Error al agregar producto al carrito");
    }
});

export default app;
