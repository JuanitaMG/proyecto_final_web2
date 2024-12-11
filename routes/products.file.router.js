import express from "express";
import {read, write} from "../utils/files.js";
import dayjs from "dayjs";
export const productsFileRouter = express.Router();

productsFileRouter.get("/", (req, res) => {
    let Products = read();
    let done = req.query.done;
    //Cambiar done de string a boolean
    if (done === 'true') {
        done = true;
    } else if (done === 'false') {
        done = false;
    }
    console.log('req.query', req.query);
    console.log('Products', Products);
    if (req.query.done || req.query.limit) {
        Products = req.query.done ? Products.filter(product => product.done === done): Products;
        Products = req.query.limit ? Products.slice(0, parseInt(req.query.limit)) : Products;
        res.json(Products);
        return;
    }
    console.log('Products', Products);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(Products));
})

productsFileRouter.post('/',
    (req, res, next) => {
        req.body.ip = req.ip;
        req.body.created_at = dayjs().format('HH:mm DD-MM-YYYY');
        next();
    }, 
    (req, res) => {
    const Products = read();
    //Añadir ID a los datos recibidos
    const product = {
        ...req.body, //Spread operator
        id: Products.length + 1
    }
    Products.push(product);
    //fs.writeFileSync('Products.json', JSON.stringify(Products));
    write(Products);
    //Código HTTP 201 Created
    res.status(201).json(Products);
})

productsFileRouter.get('/:id', (req, res) => {
    const Products = read();
    const product = Products.find(product => product.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).end();
    }
})

productsFileRouter.put('/:id',   
    (req, res, next) => {
        req.body.ip = req.ip;
        req.body.updated_at = dayjs().format('HH:mm DD-MM-YYYY');
        next();
    }, 
    (req, res) => {
        const Products = read();
        let product = Products.find(product => product.id === parseInt(req.params.id));
        if (product) {
            //Actualizar product
            product = {
                ...product,
                ...req.body
            }
            //Actualizar product en el array
            Products[
                Products.findIndex(product => product.id === parseInt(req.params.id))
            ] = product;
            //fs.writeFileSync('Products.json', JSON.stringify(Products));
            write(Products);
            res.json(product);
        } else {
            res.status(404).end();
        }
    }
)

productsFileRouter.put('/update/to/done', (req, res) => {
    let Products = read();
    Products = Products.map(product => {
        product.done = true;
        product.updated_at = dayjs().format('HH:mm DD-MM-YYYY');
        return product;
    });
    write(Products);
    res.json(Products);
})

productsFileRouter.delete('/:id', (req, res) => {
    const Products = read();
    const product = Products.find(product => product.id === parseInt(req.params.id));
    if (product) {
        //Eliminar product
        Products.splice(
            Products.findIndex(product => product.id === parseInt(req.params.id)),
            1
        );
        //fs.writeFileSync('Products.json', JSON.stringify(Products));
        write(Products);
        res.json(product);
    } else {
        res.status(404).end();
    }
})