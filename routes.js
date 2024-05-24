const express = require('express');
const route = express.Router();
const path = require('path');

const productController = require('./src/controllers/productController');
const userController = require('./src/controllers/userController');
const { loginRequired } = require('./src/middlewares/middleware');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
const upload = multer({ storage });

//Rotas de login
route.post('/api/user/register',userController.register);
route.post('/api/user/login', userController.login);
route.put('/api/user/edit/:id', userController.update);
route.delete('/api/user/delete/:id', userController.delete);

//Rotas de admin
route.get('/api/products', productController.listProducts);
route.get('/api/product/:id', productController.selectProduct);
route.post('/api/product/register', upload.single('file'), productController.register);

module.exports = route;