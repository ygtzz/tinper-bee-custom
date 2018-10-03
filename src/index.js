const Koa = require('koa');
const router = require('./router');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const koaNunjucks = require('koa-nunjucks-2');
const static = require('koa-static');
const path = require('path');

app.use(bodyParser());

app.use(static(path.join(__dirname,'./static')));

app.use(koaNunjucks({
    ext:'njk',
    path: path.join(__dirname,'./views'),
    nunjucksConfig: {
        trimBlocks: true
    }
}));

app.use(router.routes())
   .use(router.allowedMethods());


app.listen(3000);