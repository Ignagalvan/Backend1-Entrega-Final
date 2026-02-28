import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
// se actualiza a recargarr
router.get("/", async (req, res) => {
    const products = await ProductManager.getProducts();
    res.render("home", { products });
});


router.get("/realtimeproducts", async (req, res) => {
    const products = await ProductManager.getProducts();
    res.render("realTimeProducts", { products });
});

export default router;