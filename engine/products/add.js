const DATABASE = global.DATABASE;
const joi = require('joi');
const path = require('path');
const fs = require('fs');
const util = require('util');
const rename = util.promisify(fs.rename);

const unlink = util.promisify(fs.unlink);

module.exports = response => {
  const { name: fileName, path: filePath } = response.data.file;

  const schema = joi.object().keys({
    name: joi.string().min(3).max(50).required(),
    price: joi.string().regex(/^\d+$/).required()
  });

  joi.validate(response.data.body, schema, async (err) => {
    if (err) {
      await unlink(filePath);
      return response.replyErr({ message: 'Неправильно заполнены данные', status: 400 });
    }

    let newFilePath = path.join('uploads', fileName);
    await rename(filePath, path.join(process.cwd(), 'public', newFilePath));

    DATABASE.emit('products/add', { ...response.data.body, src: newFilePath })
      .then(() => response.reply(true))
      .catch(() => response.replyErr({ message: 'Какая та ошибка!' }));
  });
};
