const DB = global.DB;

module.exports = response => {
  try {
    response.reply(DB.get('skills').value());
  } catch (err) {
    response.replyErr(err);
  }
};
