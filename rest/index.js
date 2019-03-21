const Router = require('koa-router');
const koaBody = require('koa-body');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), './public', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const router = new Router();
const ENGINE = global.ENGINE;

router.get('/', async (ctx) => {
  await ENGINE.emit('index/get')
    .then(data => ctx.render('index', data))
    .catch(error => ctx.render('error', { message: error.message }));
});

router.get('/login', (req, res) => {
    await ENGINE.emit('login/get')
      .then(data => req.session.isAuth ? res.redirect('/admin') : res.render('login', data))
      .catch(error => res.render('error', { message: error.message }));
  });
  
  router.get('/admin', (req, res) => {
    await ENGINE.emit('admin/get')
      .then(data => req.session.isAuth ? res.render('admin', data) : res.redirect('/login'))
      .catch(error => res.render('error', { message: error.message }));
  });
  
  router.post('/', (req, res) => {
    await ENGINE.emit('index/post', req.body)
      .then(data => res.json(data))
      .catch(error => res.json({ message: error.message }));
  });
  
  router.post('/login', (req, res) => {
    await ENGINE.emit('login/post', req.body)
      .then(data => {
        if (data.isAuth) {
          req.session.isAuth = true;
          return res.redirect('/admin');
        } else {
          return res.render('login', data);
        }
      })
      .catch(error => res.render('error', { message: error.message }));
  });
  
  router.post('/admin/skills', (req, res) => {
    await ENGINE.emit('skills/add', req.body)
      .then(() => res.redirect('/admin'))
      .catch(error => res.render('error', { message: error.message }));
  });
  
  router.post('/admin/products', upload.single('photo'), (req, res) => {
    await ENGINE.emit('products/add', { body: req.body, file: req.file })
      .then(() => res.redirect('/admin'))
      .catch(error => {
        fs.unlinkSync(req.file.path);
        return res.render('error', { message: error.message });
      });
  });

module.exports = router;
