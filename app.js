const Koa = require('koa');
const _static = require('koa-static');
const session = require('koa-session');
const Pug = require('koa-pug');

const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const app = new Koa();

app.use(_static(path.join(__dirname, 'public')));

require('./database');
require('./engine');

const rest = require('./rest');

const pug = new Pug({
  viewPath: './views/pages',
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app
});

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      let err = {
        status: ctx.response.status,
        error: ctx.response.message
      };
      ctx.app.emit('error', err, ctx);
    }
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

app.on('error', (err, ctx) => {
  console.log('error', err)
  ctx.render('error', {
    status: ctx.response.status,
    error: err
  });
});

app.use(session({
  "key": "koa:sess",
  "maxAge": null,
  "overwrite": true,
  "httpOnly": true,
  "signed": false,
  "rolling": false,
  "renew": false
}, app))

app.use(rest.routes());

app.listen(3000, () => {
  console.log('Server start on port: 3000');
});