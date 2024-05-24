const Product = require('../models/ProductsModel');
const path = require('path');

exports.listProducts = async(req, res) => {
  try {
    const products = await Product.searchProducts();
    if(!products || products.length === 0) {
      return res.status(404).send({ error: "Nenhum produto encontrado." });
    }
    // Adiciona a URL completa para cada produto
    const host = req.protocol + '://' + req.get('host'); // http://localhost:3000
    const productsWithFullImageUrl = products.map(product => {
      const productObj = product.toObject();
      return {
        ...productObj,
        urlImg: `${host}/uploads/${path.basename(product.urlImg)}`
      };
    });

    return res.status(200).send(productsWithFullImageUrl);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.selectProduct = async(req, res) => {
  try {
    const product = await Product.searchForId(req.params.id);
    
    if(!product) return res.status(404).send({ error: "Produto não encontrado." });

    const host = req.protocol + '://' + req.get('host');
    const productObj = product.toObject();
    const productWithFullImageUrl = {
      ...productObj,
      urlImg: `${host}/uploads/${path.basename(product.urlImg)}`
    };

    res.status(200).send(productWithFullImageUrl);
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.register = async(req, res) => {
  if(!req.file || !req.body) return res.status(400).send('Informações incompletas.')

  const absoluteFilePath = req.file.path;
  const projectBaseDir = path.join(__dirname, '..', '..');
  const relativeFilePath = path.relative(projectBaseDir, absoluteFilePath);

  const body = {
    ...req.body,
    urlImg: relativeFilePath
  };
  try {
    const product = new Product(body);
    await product.register();

    if(product.errors.length > 0) return res.status(400).send(product.errors);

    res.send("Produto registrado com sucesso.");
  } catch (e) {
    res.status(500).send({error: 'Erro ao registrar o produto.'});
  }
};
