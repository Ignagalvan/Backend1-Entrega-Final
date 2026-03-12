import { Router } from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

const router = Router();

router.get("/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;

        const result = await Product.paginate({}, {
            page,
            limit,
            lean: true
        });

        res.render("products", {
            products: result.docs,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await Product.findById(pid).lean();

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        res.render("productDetail", { product });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await Cart.findById(cid)
            .populate("products.product")
            .lean();

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.render("cart", {
            products: cart.products
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default router;