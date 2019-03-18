const ENGINE = global.ENGINE;

module.exports = async response => {
    const results = await Promise.all([
        ENGINE.emit('skills/get'),
        ENGINE.emit('products/get')
    ]);

    const skills = results[0];
    const products = results[1];

    response.reply({ skills, products });
}