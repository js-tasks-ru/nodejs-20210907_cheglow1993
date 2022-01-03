const Product = require('../models/Product');
const Category = require('../models/Category');
const mapProduct = require('../mappers/product');
const isValidObjectId = require('mongoose').isValidObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({ subcategory });

  ctx.body = { products: products.map(mapProduct), };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({}) || [];
  ctx.body = {
    products: products.map(mapProduct),
  };
  next();
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;

  if (!isValidObjectId(id)) {
    ctx.status = 400;
    return next();
  }

  let product
  try {
    product = await Product.findById(id);
  } catch(err) {
    console.log(err);
  }
  
  if (!product) {
    ctx.status = 404;
    return next();
  }
  ctx.body = {product: mapProduct(product)};
  next();
};

module.exports.createProduct = async (ctx, next) => {
  const category = await Category.findOne({});
  const product = await Product.create({
    title: 'Product1',
    description: 'Lorem ipsum',
    price: 10,
    category: category.id,
    subcategory: category.subcategories[0].id,
    images: ['image1'],
  });
  await new Promise((resolve, reject) => {
    product.save(err => {
      if (err) reject(err);

      resolve();
    })
  })
    .then(() => {
      ctx.status = 201;
      ctx.set('Content-Type', 'plain/text');x
      ctx.body = product;
    })
    .catch(console.log);
};
