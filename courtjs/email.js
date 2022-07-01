var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'basketballbuild@gmail.com',
    pass: '!Prodapt1'
  }
});

var mailOptions = {
  from: 'basketballbuild@donotreplyatt.com',
  to: 'jaisimha.seelam@prodapt.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});