const socket = io();

console.log("Conectado a socket.io");

const productsList = document.getElementById("productsList");

// Escuchar la lista de productos desde el server
socket.on("products", (products) => {
    let html = "";

    if (products.length > 0) {
        html += "<ul>";
        products.forEach((p) => {
            html += `<li><b>${p.title}</b> - $${p.price} (ID: ${p.id})</li>`;
        });
        html += "</ul>";
    } else {
        html = "<p>No hay productos cargados.</p>";
    }

    productsList.innerHTML = html;
});

// Crear producto (form)
const form = document.getElementById("formProduct");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const product = {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        category: formData.get("category"),
        thumbnails: []
    };

    socket.emit("createProduct", product);
    form.reset();
});

// Eliminar producto (button)
const btnDelete = document.getElementById("btnDelete");

btnDelete.addEventListener("click", () => {
    const id = document.getElementById("deleteId").value;
    socket.emit("deleteProduct", id);
});