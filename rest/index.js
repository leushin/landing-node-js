const express = require('express');
const router = express.Router();
const ENGINE = global.ENGINE;

router.get('/', (req, res) => {
  ENGINE.emit('index/get')
    .then(data => res.render('index', data))
    .catch(error => res.render('error', { message: error.message }));
});

router.get('/login', (req, res) => {
  ENGINE.emit('login/get')
    .then(data => req.session.isAuth ? res.redirect('/admin') : res.render('login', data))
    .catch(error => res.render('error', { message: error.message }));
});

router.get('/admin', (req, res) => {
  ENGINE.emit('admin/get')
    .then(data => req.session.isAuth ? res.render('admin', data) : res.redirect('/login'))
    .catch(error => res.render('error', { message: error.message }));
});

router.post('/', (req, res) => {
  ENGINE.emit('index/post', req.body)
    .then(data => res.render('index', data))
    .catch(error => res.render('error', { message: error.message }));
});

router.post('/login', (req, res) => {
  ENGINE.emit('login/post', req.body)
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
  ENGINE.emit('skills/add', req.body)
    .then(() => res.redirect('/admin'))
    .catch(error => res.render('error', { message: error.message }));
});

router.post('/admin/products', (req, res) => {
  ENGINE.emit('products/add', req.body)
    .then(() => res.redirect('/admin'))
    .catch(error => res.render('error', { message: error.message }));
});

module.exports = router;
