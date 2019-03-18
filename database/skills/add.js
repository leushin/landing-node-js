const DB = global.DB;

module.exports = response => {
  try {
    DB.get('skills').value().forEach(item => {
      item.number = response.data[item.type];
    });
    DB.write();
    response.reply(true);
  } catch (err) {
    response.replyErr(err);
  }
};
