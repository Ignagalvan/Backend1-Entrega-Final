# Backend 1 – Entrega Final

Proyecto realizado para la entrega final del curso Backend 1.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Handlebars

## Funcionalidades

### Productos
- GET /api/products con:
  - paginación (limit, page)
  - ordenamiento (sort=asc | desc)
  - filtros por categoría o disponibilidad (query)
- GET /api/products/:pid
- POST /api/products
- PUT /api/products/:pid
- DELETE /api/products/:pid

### Carritos
- POST /api/carts
- GET /api/carts/:cid (con populate)
- POST /api/carts/:cid/products/:pid
- DELETE /api/carts/:cid/products/:pid
- PUT /api/carts/:cid
- PUT /api/carts/:cid/products/:pid
- DELETE /api/carts/:cid

### Vistas
- /products → lista de productos con paginación
- /products/:pid → detalle del producto
- /carts/:cid → vista del carrito

## Instalación

1. Clonar el repositorio
git clone <URL_DEL_REPO>
cd Backend1-Entrega-Final

2.Instalar dependencias
npm install

3.Crear archivo .env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/backend1_final

4.Ejecutar el proyecto
node src/app.js

Autor
Ignacio Diego Galván

## Notas del proyecto

Las carpetas `src/data` y `src/managers` pertenecen a la implementación inicial de la pre-entrega donde se utilizaba persistencia en archivos JSON.

En esta entrega final la persistencia principal se realiza con **MongoDB y Mongoose**, utilizando los modelos definidos en:

- `src/models/Product.js`
- `src/models/Cart.js`

Por lo tanto, esas carpetas se mantienen únicamente como referencia de la implementación anterior y no forman parte de la lógica actual del sistema.