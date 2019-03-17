const DATABASE = global.DATABASE;
const joi = require('joi');

module.exports = response => {
  const schema = joi.object().keys({
    age: joi.string().regex(/^\d+$/).required(),
    concerts: joi.string().regex(/^\d+$/).required(),
    cities: joi.string().regex(/^\d+$/).required(),
    years: joi.string().regex(/^\d+$/).required(),
  });

  joi.validate(response.data, schema, (err) => {
    if (err) {
      return response.replyErr({ message: 'Неправильно заполнены данные', status: 400 });
    }
    DATABASE.emit('skills/add', response.data)
      .then(() => response.reply(true))
      .catch(() => response.replyErr({ message: 'Какая та ошибка!' }));
  });
};
