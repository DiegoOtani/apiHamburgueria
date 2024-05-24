const mongoose = require('mongoose');
const validator = require('validator');

const ProductsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    urlImg: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
});

const ProductsModel = mongoose.model('Products', ProductsSchema);

function Products(body) {
  this.body = body;
  this.errors = [];
  this.products = null;
  
  this.valida();
}

Products.prototype.register = async function(){
    this.valida();

    if(this.errors.length > 0) return;
    this.products = await ProductsModel.create(this.body);
};

Products.prototype.valida = function() {
    if(!this.body.name) this.errors.push('Nome é um campo obrigatório.');
    if(!this.body.urlImg) this.errors.push('Url da imagem é um campo obrigatório.');
    if(!this.body.description) this.errors.push('Descrição é um campo obrigatório.');
    if(!this.body.price) this.errors.push('Preço é um campo obrigatório.');
};

Products.prototype.edit = async function(id){
    this.valida();

    if(this.errors.length > 0) return;

    this.products = await ProductsModel.findByIdAndUpdate(id, this.body, {new: true});
};

Products.searchForId = async function (id) {
    const products = await ProductsModel.findById(id);
    return products;
};

Products.searchProducts = async function() {
    const products = await ProductsModel.find()
        .sort({ name: 1 });
    return products;
};

Products.delete = async function(id) {
    const products = await ProductsModel.findByIdAndDelete({_id: id});
    return products;
};

module.exports = Products;