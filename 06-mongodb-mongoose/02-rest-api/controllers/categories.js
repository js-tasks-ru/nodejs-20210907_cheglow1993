const Category = require('../models/Category');
const mapCategory = require('../mappers/category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({});

  ctx.body = {categories: categories.map(mapCategory)};
  next();
};

module.exports.createCategory = async (ctx, next) => {
  const {title} = ctx.request.body;

  if (!title) {
    ctx.status = 500;
    return next();
  }

  const category = new Category({
    title,
    subcategories: [ {title: 'Subcategory1'} ],
  });

  await new Promise((resolve, reject) => {
    category.save(err => {
      if (err) reject(err);

      resolve();
    });
  })
  .then(() => {
    ctx.status = 200;
    ctx.set('Content-Type', 'text/plain');
    ctx.body = mapCategory(category);
  })
  .catch(console.log);
};
