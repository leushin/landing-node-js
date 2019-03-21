const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = response => {
  User.find()
    .then(items => {
      if (items.length) {
        console.log(items[0])
        response.reply(items[0]);
      }
    })
    .catch((err) => {
      response.replyErr(err);
    });
};