import nodemailer from "nodemailer"
import config from "../config/config.js"


const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        type : "OAUTH2",
        user : config.googleUser,
        clientId : config.googleClientId,
        clientSecret : config.googleClientSecret,
        refreshToken : config.googleRefreshToken
    }
})

transporter.verify((error,success)=>{
    error ? console.log('Error connecting to email server ', error) : 
    console.log('Email server is ready to send messages');
})

// function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${config.googleUser}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};