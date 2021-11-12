const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

//three params for mail details
const sentMail = async (email, subject, text) => {
  //transport mail details
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USERNAME,
      PASS: process.env.MAILER_PASSWORD,
    },
  });

  //details
  var mailOptions = {
    from: "muthutest789@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error in sending mail", error);
    } else {
      console.log("email sent:" + info.response);
    }
  });
};
