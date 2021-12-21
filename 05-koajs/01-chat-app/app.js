const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let subscribers = [];

router.get('/subscribe', async (ctx, next) => {
    await new Promise(resolve => { subscribers.push(resolve); })
        .then((message) => {
            ctx.status = 200;
            ctx.response.body = message;

            next();
        });
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;
    ctx.response.status = 200;

    if (!message) return next();

    subscribers.forEach(resolve => {
        resolve(message);
    });

    subscribers = [];
    next();
});

app.use(router.routes());

module.exports = app;
