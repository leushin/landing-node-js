const ee = require('@nauma/eventemitter');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const joi = require('joi');
const nodemailer = require('nodemailer');
const config = require('../config.json');
const ENGINE = new ee.EventEmitter('engine');
global.ENGINE = ENGINE;

const skillsGet = require('./skills/get');
const skillsAdd = require('./skills/add');
const productsGet = require('./products/get');
const productsAdd = require('./products/add');
const usersGet = require('./users/get');

ENGINE.on('index/get', async response => {
    const results = await Promise.all([
        ENGINE.emit('skills/get'),
        ENGINE.emit('products/get')
    ]);

    const skills = results[0];
    const products = results[1];

    response.reply({ skills, products });
});

ENGINE.on('login/get', async response => {
    response.reply({});
})

ENGINE.on('login/post', async response => {
    const { email, password } = response.data;
    const users = await ENGINE.emit('users/get');
    if (users.admin.email === email && users.admin.password === password) {
        response.reply({ isAuth: true });
    } else {
        response.reply({ isAuth: false, msgslogin: 'Неверные логин или пароль' });
    }
})

ENGINE.on('admin/get', response => {
    response.reply({});
})

ENGINE.on('skills/get', skillsGet);
ENGINE.on('skills/add', skillsAdd);

ENGINE.on('products/get', productsGet);
ENGINE.on('products/add', async response => {
  const form = new formidable.IncomingForm();

  form.uploadDir = path.join(process.cwd(), './public', 'upload');

  console.log(form);

  form.parse(response.data, (err, fields, files) => {
    console.log('fields', fields);
    console.log('files', files);
    if (err) {
      return response.replyErr(err.message);
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, err => {
      if (err) {
        console.error(err.message);
        return response.replyErr(err);
      }
    });
  });
});

ENGINE.on('users/get', usersGet);

ENGINE.on('index/post', response => {
  console.log(response.data);
  const schema = joi.object().keys({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().max(30).required(),
    message: joi.string().max(1000).required()
  });

  joi.validate(response.data, schema, (err, { name, email, message }) => {
    if (err) {
      return response.replyErr({ message: err.details[0].message });
    }

    const transporter = nodemailer.createTransport(config.mail.smtp);

    const options = {
      from: `"${name}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text: message + `\n Отправлено с: <${email}>`
    };

    transporter
      .sendMail(options)
      .then(() =>
        response.reply({ msgemail: 'Письмо успешно отправлено!' })
      )
      .catch(error =>
        response.replyErr({ message: `При отправке письма произошла ошибка!: ${error}` })
      );
  });
});