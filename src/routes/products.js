import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();


router.get("/", async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        res.json(products);
    } catch (error) {
        console.log("Error al obtener productos:", error);
        res.send("Error al obtener productos");
    }
});


router.get("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await ProductManager.getProductById(pid);

        if (!product) {
            console.log("Producto no encontrado:", pid);
            return res.send("Producto no encontrado");
        }

        res.json(product);
    } catch (error) {
        console.log("Error al buscar producto:", error);
        res.send("Error al buscar producto");
    }
});


router.post("/", async (req, res) => {
    try {
        const body = req.body;

        
        if (
            !body.title ||
            !body.description ||
            !body.code ||
            body.price == null ||
            body.stock == null ||
            !body.category
        ) {
            console.log("Faltan campos obligatorios");
            return res.send("Faltan campos obligatorios");
        }

        const newProduct = await ProductManager.addProduct(body);
        res.json(newProduct);
    } catch (error) {
        console.log("Error al crear producto:", error);
        res.send("Error al crear producto");
    }
});


router.put("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const body = req.body;

        const updatedProduct = await ProductManager.updateProduct(pid, body);

        if (!updatedProduct) {
            console.log("Producto no encontrado para actualizar:", pid);
            return res.send("Producto no encontrado");
        }

        res.json(updatedProduct);
    } catch (error) {
        console.log("Error al actualizar producto:", error);
        res.send("Error al actualizar producto");
    }
});


router.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const deleted = await ProductManager.deleteProduct(pid);

        if (!deleted) {
            console.log("Producto no encontrado para eliminar:", pid);
            return res.send("Producto no encontrado");
        }

        res.send("Producto eliminado correctamente");
    } catch (error) {
        console.log("Error al eliminar producto:", error);
        res.send("Error al eliminar producto");
    }
});

export default router;
