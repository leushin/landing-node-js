const DATABASE = global.DATABASE;
const joi = require('joi');
const path = require('path');

module.exports = response => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(50).required(),
    price: joi.string().regex(/^\d+$/).required()
  });

  joi.validate(response.data.body, schema, (err) => {
    if (err) {
      return response.replyErr({ message: 'Неправильно заполнены данные', status: 400 });
    }
    DATABASE.emit('products/add', { ...response.data.body, src: path.join('./uploads', response.data.file.filename) })
      .then(() => response.reply(true))
      .catch(() => response.replyErr({ message: 'Какая та ошибка!' }));
  });
};
