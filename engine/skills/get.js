const DATABASE = global.DATABASE;
//const MEMCACHE = global.MEMCACHE;

module.exports = response => {

  DATABASE.emit('skills/get')
    .then(data => response.reply(data))
    .catch(() => response.replyErr({ message: 'Какая та ошибка!' }));

};
