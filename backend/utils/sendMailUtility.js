const nodemailer = require("nodemailer");

require("dotenv").config({
  path: "../.env",
});

async function sendMail(mailId) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    const info = await transporter.sendMail({
      from: "FilmyBuffs",
      to: `${mailId}`,
      subject: "Your otp",
      text: "Enter the otp and proceed further!",
      html: `<b>${otp}</b>`,
    });
    return otp;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function sendSuccessMail(mailId, user, post) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: "FilmyBuffs",
      to: `${mailId}`,
      subject: `Congratulations!! ${user}`,
      text: "Your application is selected!",
      html: `<div style="background-color: #f8f9fa; padding: 20px; font-family: Arial, sans-serif; border-radius: 10px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="border-radius: 40px;">
            <img src="https://dl6pgk4f88hky.cloudfront.net/2021/12/2ATHYW0-1038x778.jpg" alt="FilmyBuffs Logo" style="max-width: 100px; border-radius: 20px;">
          </td>
        </tr>
        <tr>
          <td style="padding-top: 20px; text-align: center;">
            <h2 style="color: #007bff; margin: 0;">Congratulations, ${user}!</h2>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px; text-align: center;">
            <p style="margin: 0;">Your application for <span style="font-weight: bold;">${post}</span> has been selected!</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 10px; text-align: center;">
            <p style="margin: 0;">We're excited to have you join our team.</p>
          </td>
        </tr>
        <tr>
          <td style="padding-top: 20px; text-align: center;">
            <p style="margin: 0;">Best regards,<br/>The FilmyBuffs Team</p>
          </td>
        </tr>
      </table>
    </div>
    `,
    });
    return "sent";
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = {
  sendMail,
  sendSuccessMail,
};
