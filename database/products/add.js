const DB = global.DB;

module.exports = response => {
  try {
    DB.get('products').push(response.data).write();
    response.reply(true);
  } catch (err) {
    response.replyErr(err);
  }
};
