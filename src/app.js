import express from "express";
import { engine } from "express-handlebars";
import { createServer } from "http";
import { Server } from "socket.io";

import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
import viewsRouter from "./routes/views.router.js";

const app = express();


app.use(express.json());


app.use(express.static("./src/public"));


app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.use("/", viewsRouter);


const httpServer = createServer(app);
const io = new Server(httpServer);

import ProductManager from "./managers/ProductManager.js";

io.on("connection", async (socket) => {
    console.log("Cliente conectado:", socket.id);

    // Enviar lista actual cuando alguien se conectaaaa
    const products = await ProductManager.getProducts();
    socket.emit("products", products);

    // Crear producto por websocket
    socket.on("createProduct", async (data) => {
        await ProductManager.addProduct(data);

        const updatedProducts = await ProductManager.getProducts();
        io.emit("products", updatedProducts);
    });

    // Eliminar producto por websocket
    socket.on("deleteProduct", async (pid) => {
        await ProductManager.deleteProduct(pid);

        const updatedProducts = await ProductManager.getProducts();
        io.emit("products", updatedProducts);
    });
});

httpServer.listen(8080, () => {
    console.log("Server running on port 8080");
});