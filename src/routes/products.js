import { Router } from "express";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort;
        const query = req.query.query;

        const filter = {};
        const options = {
            limit,
            page,
            lean: true
        };

        if (query) {
            if (query === "available") {
                filter.stock = { $gt: 0 };
            } else {
                filter.category = query;
            }
        }

        if (sort === "asc") {
            options.sort = { price: 1 };
        } else if (sort === "desc") {
            options.sort = { price: -1 };
        }

        const result = await Product.paginate(filter, options);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/api/products?page=${result.prevPage}&limit=${limit}`
                : null,
            nextLink: result.hasNextPage
                ? `/api/products?page=${result.nextPage}&limit=${limit}`
                : null
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await Product.findById(pid).lean();

        if (!product) {
            return res.status(404).json({
                status: "error",
                error: "Producto no encontrado"
            });
        }

        res.json({
            status: "success",
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || price == null || stock == null || !category) {
            return res.status(400).json({
                status: "error",
                error: "Faltan campos obligatorios"
            });
        }

        const newProduct = await Product.create({
            title,
            description,
            code,
            price,
            status: status ?? true,
            stock,
            category,
            thumbnails: thumbnails || []
        });

        res.status(201).json({
            status: "success",
            payload: newProduct
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            pid,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                status: "error",
                error: "Producto no encontrado"
            });
        }

        res.json({
            status: "success",
            payload: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(pid);

        if (!deletedProduct) {
            return res.status(404).json({
                status: "error",
                error: "Producto no encontrado"
            });
        }

        res.json({
            status: "success",
            message: "Producto eliminado"
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

export default router;