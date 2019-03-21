const ee = require('@nauma/eventemitter');
const mongoose = require('mongoose');
const DATABASE = new ee.EventEmitter('database');
global.DATABASE = DATABASE;

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

mongoose
  .connect('mongodb://localhost:27017/db', { useNewUrlParser: true })
  .catch(err => {
    console.error(err);
    throw err;
  });

mongoose.connection.on('connected', () => console.log('Mongoose default connection open'));
mongoose.connection.on('disconnected', () => console.log('Mongoose default connection disconnected'));

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

const models = {
  users: mongoose.model('User', new Schema({ email: String, password: String })),
  skills: mongoose.model('Skill', new Schema({ type: String, number: String, text: String })),
  products: mongoose.model('Product', new Schema({ src: String, name: String, price: Number }))
};

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

Object.keys(defaultData).forEach((key) => {
  models[key].find({}, (err, items) => {
    if (!items.length) {
      models[key].insertMany(defaultData[key], err => console.log(err));
    }
  });
});

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
