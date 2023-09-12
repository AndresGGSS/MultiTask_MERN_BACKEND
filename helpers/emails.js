import nodemailer from 'nodemailer'

const emailRegistration = async (data) => {
    const {email,name,token} = data

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    const info = await transport.sendMail({
        from: '"MultiTask - Project Manager" <accounts@MultiTask.com>',
        to: email,
        subject: "MultiTask - Check your account",
        text: "Check your account in MultiTask",
        html:`<p> Dear ${name} We are thrilled to welcome you to MultiTask</p>
        <p>Your ultimate solution for efficient task management.
        To get started, we kindly ask you to verify your user account. 
        This step ensures the security of your data and enables you to access all the features and benefits that MultiTask has to offer.</p>
        <p>Check your account in the following link in the following link</p>
        <a href="${process.env.FRONTEND_URL}/confirm/${token}">Check the account</a>`
    })
}

const emailForgotPassword = async (data) => {
  const {email,name,token} = data

  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const info = await transport.sendMail({
      from: '"MultiTask - Project Manager" <accounts@MultiTask.com>',
      to: email,
      subject: "MultiTask - Password Reset",
      text: "Reset your password in MultiTask",
      html: `
        <p>Dear ${name},</p>
        <p>We have received a request to reset your password for your MultiTask account.</p>
        <p>To reset your password, please click on the following link:</p>
        <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset Password</a>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
        <p>Best regards,</p>
        <p>The MultiTask Team</p>
      `,
    });    
}

export {emailRegistration, emailForgotPassword}