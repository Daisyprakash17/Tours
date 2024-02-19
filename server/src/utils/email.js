const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const sendEmail = async (options) => {
  // Create a transporter
  let transporter;
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport(
      nodemailerSendgrid({
           apiKey: process.env.SENDGRID_PASSWORD
        })
      );
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Define email options
  const emailOptions = {
    from: `Natours Team <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send email
  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
