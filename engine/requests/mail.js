const joi = require('joi');
const nodemailer = require('nodemailer');
const config = require('../../config.json');

module.exports = response => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(50).required(),
    email: joi.string().email().max(30).required(),
    message: joi.string().max(1000).required()
  });

  joi.validate(response.data, schema, (err, { name, email, message }) => {
    if (err) {
      return response.replyErr({ message: err.details[0].message });
    }

    const transporter = nodemailer.createTransport(config.mail.smtp);

    const options = {
      from: `"${name}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text: message + `\n Отправлено с: <${email}>`
    };

    transporter
      .sendMail(options)
      .then(() =>
        response.reply({ msgemail: 'Письмо успешно отправлено!' })
      )
      .catch(error =>
        response.replyErr({ message: `При отправке письма произошла ошибка!: ${error}` })
      );
  });
}