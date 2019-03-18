const ee = require('@nauma/eventemitter');
const ENGINE = new ee.EventEmitter('engine');
global.ENGINE = ENGINE;

const indexGet = require('./pages/index');
const loginGet = require('./pages/login');
const adminGet = require('./pages/admin');
const skillsGet = require('./skills/get');
const skillsAdd = require('./skills/add');
const productsGet = require('./products/get');
const productsAdd = require('./products/add');
const usersGet = require('./users/get');
const requestAuth = require('./requests/auth');
const requestMail = require('./requests/mail');

ENGINE.on('index/get', indexGet);
ENGINE.on('login/get', loginGet);
ENGINE.on('admin/get', adminGet);

ENGINE.on('skills/get', skillsGet);
ENGINE.on('skills/add', skillsAdd);

ENGINE.on('products/get', productsGet);
ENGINE.on('products/add', productsAdd);

ENGINE.on('login/post', requestAuth);
ENGINE.on('index/post', requestMail);

ENGINE.on('users/get', usersGet);
