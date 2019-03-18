const DB = global.DB;

module.exports = response => {
  try {
    response.reply(DB.get('users').value());
  } catch (err) {
    response.replyErr(err);
  }
};
