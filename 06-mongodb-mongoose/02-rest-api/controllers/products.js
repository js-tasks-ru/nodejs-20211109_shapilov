const Product = require('../models/Product');
const mapProduct = require('../mappers/product')
const mongoose = require('mongoose');

module.exports.productList = async function productList(ctx, next) {
  let query = {};
  const {subcategory} = ctx.query;
  
  if (subcategory) {
    query.subcategory = subcategory;
  }

  const productsModels = await Product.find(query);

  let products = [];

  productsModels.forEach((product) => products.push(mapProduct(product)));

  ctx.body = {products};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    ctx.throw(400, 'Bad request');
  }

  const product = await Product.findById(id);

  if (!product) {
    ctx.throw(404, 'Not found');
  }

  ctx.body = {product: mapProduct(product)};
};

