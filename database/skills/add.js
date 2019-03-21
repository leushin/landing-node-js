const mongoose = require('mongoose');
const Skill = mongoose.model('Skill');

module.exports = response => {
  const updatePromises = [];

  Object.keys(response.data).forEach(type => {
    updatePromises.push(Skill.findOneAndUpdate({ type }, { number: response.data[type] }));
  });

  Promise.all(updatePromises)
    .then(() => {
      response.reply(true);
    })
    .catch((err) => {
      response.replyErr(err);
    });
};
