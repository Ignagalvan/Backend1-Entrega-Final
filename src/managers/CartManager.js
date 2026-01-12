import fs from "fs";

class CartManager {

    static #path = "./src/data/carts.json";

    static async #initFileIfNotExists() {
        const existe = fs.existsSync(this.#path);
        if (!existe) {
            const dataVacia = { payload: [] };
            await fs.promises.writeFile(this.#path, JSON.stringify(dataVacia, null, 2));
        }
    }

    static async getCarts() {
        await this.#initFileIfNotExists();
        const resultado = await fs.promises.readFile(this.#path, "utf-8");
        const data = JSON.parse(resultado);
        return data.payload;
    }

    // POST /
    static async createCart() {
        await this.#initFileIfNotExists();
        const resultado = await fs.promises.readFile(this.#path, "utf-8");
        const data = JSON.parse(resultado);

        const payload = data.payload;
        const newId = payload.length === 0 ? 1 : payload[payload.length - 1].id + 1;

        const newCart = {
            id: newId,
            products: []
        };

        data.payload.push(newCart);
        await fs.promises.writeFile(this.#path, JSON.stringify(data, null, 2));

        return newCart;
    }

    // GET /:cid
    static async getCartsById(cid) {
        const products = await this.getCarts();
        return products.find(p => p.id === cid || String(p.id) === String(cid));
    }

    // POST /:cid/product/:pid
    static async addProductToCart(cid, pid) {
        await this.#initFileIfNotExists();
        const resultado = await fs.promises.readFile(this.#path, "utf-8");
        const data = JSON.parse(resultado);

        const cartIndex = data.payload.findIndex(c => String(c.id) === String(cid));
        if (cartIndex === -1) return null;

        const cart = data.payload[cartIndex];

        const itemIndex = cart.products.findIndex(p => String(p.product) === String(pid));

        if (itemIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[itemIndex].quantity += 1;
        }

        data.payload[cartIndex] = cart;
        await fs.promises.writeFile(this.#path, JSON.stringify(data, null, 2));

        return cart;
    }
}

export default CartManager;