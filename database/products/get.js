const DB = global.DB;

module.exports = response => {
  try {
    response.reply(DB.get('products').value());
  } catch (err) {
    response.replyErr(err);
  }
};
