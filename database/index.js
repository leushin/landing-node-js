const ee = require('@nauma/eventemitter');
const DATABASE = new ee.EventEmitter('database');
global.DATABASE = DATABASE;

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const DB = low(adapter);

DB.defaults({
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
  'products': [
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
  'users': {
    'admin': {
      'email': 'admin@test.ru',
      'password': 'admin'
    }
  }
}).write();

DATABASE.on('skills/get', response => {
  try {
    response.reply(DB.get('skills').value());
  } catch (err) {
    response.replyErr(err);
  }
});

DATABASE.on('skills/add', response => {
  try {
    DB.get('skills').value().forEach(item => {
      item.number = response.data[item.type];
    });
    DB.write();
    response.reply(true);
  } catch (err) {
    response.replyErr(err);
  }
});

DATABASE.on('products/get', response => {
  try {
    response.reply(DB.get('products').value());
  } catch (err) {
    response.replyErr(err);
  }
});

DATABASE.on('users/get', response => {
  try {
    response.reply(DB.get('users').value());
  } catch (err) {
    response.replyErr(err);
  }
});
