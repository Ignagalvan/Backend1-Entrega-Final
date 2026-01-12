import fs from "fs";

class ProductManager {
    static #path = "./src/data/products.json";

    // Crea el archivo si no existe
    static async #initFileIfNotExists() {
        const existe = fs.existsSync(this.#path);
        if (!existe) {
            const dataVacia = { payload: [] };
            await fs.promises.writeFile(this.#path, JSON.stringify(dataVacia, null, 2));
        }
    }

    // GET /
    static async getProducts() {
        await this.#initFileIfNotExists();
        const resultado = await fs.promises.readFile(this.#path, "utf-8");
        const data = JSON.parse(resultado);
        return data.payload;
    }

    //GET /:pid
    static async getProductById(pid) {
        const products = await this.getProducts();
        return products.find(p => p.id === pid || String(p.id) === String(pid));
    }

    //POST /
    static async addProduct(productData) {
        await this.#initFileIfNotExists();
        const resultado = await fs.promises.readFile(this.#path, "utf-8");
        const data = JSON.parse(resultado);

        // Autogenerar id (simple y estilo profe)
        const payload = data.payload;
        const newId = payload.length === 0 ? 1 : payload[payload.length - 1].id + 1;

        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: productData.status ?? true,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails ?? []
        };

        data.payload.push(newProduct);
        await fs.promises.writeFile(this.#path, JSON.stringify(data, null, 2));
        console.log("Se subio correctamente el producto");
        return newProduct;
    }

    //PUT /:pid
    static async updateProduct(pid, updates) {
        await this.#initFileIfNotExists();
        const resultado = await fs.promises.readFile(this.#path, "utf-8");
        const data = JSON.parse(resultado);

        const index = data.payload.findIndex(p => String(p.id) === String(pid));
        if (index === -1) return null;

        // No permitir update de id aunque venga en body
        const { id, ...rest } = updates;

        data.payload[index] = { ...data.payload[index], ...rest };
        await fs.promises.writeFile(this.#path, JSON.stringify(data, null, 2));

        return data.payload[index];
    }

    // DELETE /:pid
    static async deleteProduct(pid) {
        await this.#initFileIfNotExists();
        const resultado = await fs.promises.readFile(this.#path, "utf-8");
        const data = JSON.parse(resultado);

        const index = data.payload.findIndex(p => String(p.id) === String(pid));
        if (index === -1) return false;

        data.payload.splice(index, 1);
        await fs.promises.writeFile(this.#path, JSON.stringify(data, null, 2));

        return true;
    }
}

export default ProductManager;