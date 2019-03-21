const mongoose = require('mongoose');
const Product = mongoose.model('Product');

module.exports = response => {
  const newProduct = new Product(response.data);

  newProduct.save()
    .then(() => {
      response.reply(true);
    })
    .catch((err) => {
      response.replyErr(err);
    });
};
