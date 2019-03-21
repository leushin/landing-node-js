const mongoose = require('mongoose');
const Product = mongoose.model('Product');

module.exports = response => {
  Product.find()
    .then(items => {
      if (items.length) {
        response.reply(items);
      }
    })
    .catch((err) => {
      response.replyErr(err);
    });
};