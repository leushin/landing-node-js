const Router = require('koa-router');
const koaBody = require('koa-body');

const path = require('path');
const fs = require('fs');

const router = new Router();
const ENGINE = global.ENGINE;

const koaMulti = koaBody({
  multipart: true,
  formidable: {
    uploadDir: process.cwd() + '/public/uploads'
  }
});

router.get('/', async (ctx) => {
  await ENGINE.emit('index/get')
    .then(data => ctx.render('index', data))
    .catch(error => ctx.render('error', { message: error.message }));
});

router.get('/login', async (ctx) => {
    await ENGINE.emit('login/get')
      .then(data => ctx.session.isAuth ? ctx.redirect('/admin') : ctx.render('login', data))
      .catch(error => ctx.render('error', { message: error.message }));
  });
  
  router.get('/admin', async (ctx) => {
    await ENGINE.emit('admin/get')
      .then(data => ctx.session.isAuth ? ctx.render('admin', data) : ctx.redirect('/login'))
      .catch(error => ctx.render('error', { message: error.message }));
  });
  
  router.post('/', koaBody(), async (ctx) => {
    await ENGINE.emit('index/post', ctx.request.body)
      .then(data => ctx.json(data))
      .catch(error => ctx.json({ message: error.message }));
  });
  
  router.post('/login', koaBody(), async (ctx) => {
    await ENGINE.emit('login/post', ctx.request.body)
      .then(data => {
        if (data.isAuth) {
          ctx.session.isAuth = true;
          return ctx.redirect('/admin');
        } else {
          return ctx.render('login', data);
        }
      })
      .catch(error => ctx.render('error', { message: error.message }));
  });
  
  router.post('/admin/skills', koaBody(), async (ctx) => {
    await ENGINE.emit('skills/add', ctx.request.body)
      .then(() => ctx.redirect('/admin'))
      .catch(error => ctx.render('error', { message: error.message }));
  });
  
  router.post('/admin/products', koaMulti, async (ctx) => {
    await ENGINE.emit('products/add', { body: ctx.request.body, file: ctx.request.files.photo })
      .then(() => ctx.redirect('/admin'))
      .catch(error => ctx.render('error', { message: error.message }));
  });

module.exports = router;
