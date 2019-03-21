//const DB = global.DB;
const mongoose = require('mongoose');
const Skill = mongoose.model('Skill');

module.exports = response => {
  Skill.find()
    .then(items => {
      if (items.length) {
        response.reply(items);
      }
    })
    .catch((err) => {
      response.replyErr(err);
    });
};