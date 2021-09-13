const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SAND_GRID_API_KEY);

const sendVerificationCode = async (to, code) => {
  const msg = {
    to,
    from: "contact@frescopad.com",
    subject: "Verification Code",
    html: `<div>
            <div>Here is your verification code for auth app</div>
            <b>${code}</b>
          </div>`,
  };

  try {
    const st = await sgMail.send(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = {
  sendVerificationCode,
};
