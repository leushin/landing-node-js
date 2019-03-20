const ee = require('@nauma/eventemitter');
const mongoose = require('mongoose');
const DATABASE = new ee.EventEmitter('database');
global.DATABASE = DATABASE;

//const low = require('lowdb');
//const FileSync = require('lowdb/adapters/FileSync');

//const adapter = new FileSync('db.json');
//const DB = low(adapter);

const Schema = mongoose.Schema;

// подключение
const DB = mongoose.connect('mongodb://localhost:27017/landing', { useNewUrlParser: true });

const Skill = mongoose.model('Skill', new Schema({ email: String, password: String }));
const Product = mongoose.model('Product', new Schema({ src: String, name: String, price: Number }));
const User = mongoose.model('User', new Schema({ email: String, password: String }));

const defaultData = {
  skills: [
    {
      'type': 'age',
      'number': '1',
      'text': 'Возраст начала занятий на скрипке'
    },
    {
      'type': 'concerts',
      'number': '1',
      'text': 'Концертов отыграл'
    },
    {
      'type': 'cities',
      'number': '1',
      'text': 'Максимальное число городов в туре'
    },
    {
      'type': 'years',
      'number': '1',
      'text': 'Лет на сцене в качестве скрипача'
    }
  ],
  products: [
    {
      'src': './assets/img/products/Work1.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    },
    {
      'src': './assets/img/products/Work2.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    },
    {
      'src': './assets/img/products/Work3.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    },
    {
      'src': './assets/img/products/Work4.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    },
    {
      'src': './assets/img/products/Work5.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    },
    {
      'src': './assets/img/products/Work6.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    },
    {
      'src': './assets/img/products/Work7.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    },
    {
      'src': './assets/img/products/Work8.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    },
    {
      'src': './assets/img/products/Work9.jpg',
      'name': 'Вино вдохновение',
      'price': 600
    }
  ],
  users: [{
    'email': 'admin@test.ru',
    'password': 'admin'
  }]
};

User.create({
  'email': 'admin@test.ru',
  'password': 'admin'
}, err => console.log(err));

global.DB = DB;

const skillsGet = require('./skills/get');
const skillsAdd = require('./skills/add');
const productsGet = require('./products/get');
const productsAdd = require('./products/add');
const usersGet = require('./users/get');

DATABASE.on('skills/get', skillsGet);
DATABASE.on('skills/add', skillsAdd);

DATABASE.on('products/get', productsGet);
DATABASE.on('products/add', productsAdd);

DATABASE.on('users/get', usersGet);
