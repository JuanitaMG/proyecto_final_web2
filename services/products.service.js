import { sequelize } from '../libs/sequelize.js';

async function index() {
    console.log('INDEX /api/v1/products');
    const products = await sequelize.models.Product.findAll(); 
    return products;
}

async function create(product) {
    console.log('CREATE /api/v1/products');
    const newProduct = await sequelize.models.Product.create({
        name: product.name,
        done: product.done || false,
        brand: product.brand || null,
        price: product.price || null,
        category: product.category || null,
        description: product.description || null,
        imagePath: product.imagePath || 'images/' 
    });
    return newProduct;
}

async function show(id) {
    console.log('SHOW /api/v1/products/:id');
    const product = await sequelize.models.Product.findByPk(id); 
    return product;
}

async function update(id, product) {
    console.log('UPDATE /api/v1/products/:id');
    const searchedProduct = await sequelize.models.Product.findByPk(id);
    if (!searchedProduct) {
        return false;
    }

    const [rowsAffected, [updatedProduct]] = await sequelize.models.Product.update({
        name: product.name,
        done: product.done || false,
        brand: product.brand || null,
        price: product.price || null,
        category: product.category || null,
        description: product.description || null,
        imagePath: product.imagePath || 'images/', 
    }, {
        where: { id },
        returning: true
    });
    return updatedProduct;
}


async function destroy(id) {
    console.log('DESTROY /api/v1/products/:id');
    const product = await sequelize.models.Product.findByPk(id); 
    if (!product) {
        return false;
    }

    await sequelize.models.Product.destroy({ 
        where: {
            id
        }
    });
    return product;
}

async function getProductsGroupedByCategory() {
    console.log('GET PRODUCTS GROUPED BY CATEGORY');
    const products = await sequelize.models.Product.findAll(); 
    const categories = {};

    // Agrupar productos por categoría
    products.forEach(product => {
        if (!categories[product.category]) {
            categories[product.category] = { name: product.category, products: [] };
        }
        categories[product.category].products.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imagePath: product.imagePath, 
        });
    });

    // Convertir objeto a arreglo
    return Object.values(categories);
}


export {
    index,
    create,
    show,
    update,
    destroy,
    getProductsGroupedByCategory
};