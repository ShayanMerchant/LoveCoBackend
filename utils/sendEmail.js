const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "shayanmerchant123@gmail.com",
                pass: "vvwvcgbhqiegphkn",
            },
        });

        await transporter.sendMail({
            from: "shayanmerchant123@gmail.com",
            to: email,
            subject: subject,
            text: text,
        });

        console.log("Email sent sucessfully");
    } catch (error) {
        console.log(error, "Email not sent");
    }
};

module.exports = sendEmail;