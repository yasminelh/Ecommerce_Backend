require("dotenv").config();

const nodemailer = require("nodemailer");
const sendMail = async (email, mailSubject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_ADRESS,
      to: email,
      subject: mailSubject,
      html: content,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("email sent : " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = sendMail;
