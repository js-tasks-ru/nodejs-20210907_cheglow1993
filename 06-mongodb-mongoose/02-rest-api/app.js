const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')
const {productsBySubcategory, productList, productById, createProduct} = require('./controllers/products');
const {categoryList, createCategory} = require('./controllers/categories');

const app = new Koa();

app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/categories', categoryList);
router.post('/categories', createCategory);
router.get('/products', productsBySubcategory, productList);
router.get('/products/:id', productById);
router.post('/products', createProduct);

app.use(router.routes());

module.exports = app;
