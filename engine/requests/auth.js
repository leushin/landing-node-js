const ENGINE = global.ENGINE;

module.exports = async response => {
    const { email, password } = response.data;
    const users = await ENGINE.emit('users/get');
    if (users.email === email && users.password === password) {
        response.reply({ isAuth: true });
    } else {
        response.reply({ isAuth: false, msgslogin: 'Неверные логин или пароль' });
    }
}