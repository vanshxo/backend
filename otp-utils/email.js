const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

// Evolvx Brand Colors
const EVOLVX_BRAND = {
  primary: '#FF6B00',   // Bright Orange
  secondary: '#FDCB06', // Yellow Accent
  background: '#0D1B2A', // Navy/Dark blue
  darkText: '#1A1A1A',
  white: '#FFFFFF',
  gray: '#9CA3AF',
};

const EVOLVX_SUPPORT_EMAIL = 'evolvx.org@gmail.com'; // Replace with actual

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
      user: process.env.EVOLVX_EMAIL_USER, // Add to `.env`
      pass: process.env.EVOLVX_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Evolvx Team" <${EVOLVX_SUPPORT_EMAIL}>`,
    to: `${to}`,
    subject: 'Evolvx OTP Verification Code',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <title>Evolvx OTP Verification</title>
    </head>
    <body style="margin:0;padding:0;background-color:${EVOLVX_BRAND.background};font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 0;background-color:${EVOLVX_BRAND.background};">
        <tr>
          <td align="center">
            <table width="100%" style="max-width:600px;background-color:${EVOLVX_BRAND.white};border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);" cellpadding="0" cellspacing="0" border="0">
              
              <!-- Header -->
              <tr>
                <td style="padding:24px 40px;background-color:${EVOLVX_BRAND.primary};text-align:center;">
                  <h1 style="margin:0;font-size:28px;font-weight:700;color:${EVOLVX_BRAND.white};">
                    E V O L V X
                  </h1>
                  <p style="color:${EVOLVX_BRAND.white};margin:4px 0 0;font-size:14px;">Empowering Young Entrepreneurs</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 40px 20px 40px;text-align:center;">
                  <h2 style="color:${EVOLVX_BRAND.primary};font-size:22px;margin:0 0 18px;">Your One-Time Password (OTP)</h2>
                  <p style="font-size:16px;color:${EVOLVX_BRAND.darkText};line-height:1.6;margin:0 0 20px;">
                    Use the OTP below to verify your email for Evolvx registration.
                    This code is valid for <strong>10 minutes</strong>.
                  </p>
                  <div style="background-color:${EVOLVX_BRAND.primary};color:${EVOLVX_BRAND.white};padding:16px 32px;border-radius:8px;display:inline-block;font-size:32px;font-weight:bold;letter-spacing:8px;margin:20px 0;">
                    ${otp}
                  </div>
                  <p style="font-size:14px;color:${EVOLVX_BRAND.gray};margin-top:20px;">
                    If you did not initiate this request, you can ignore this email or contact 
                    <a href="mailto:${EVOLVX_SUPPORT_EMAIL}" style="color:${EVOLVX_BRAND.primary};text-decoration:none;">support</a>.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px;text-align:center;background-color:${EVOLVX_BRAND.background};">
                  <p style="font-size:13px;color:${EVOLVX_BRAND.gray};margin:0;">
                    © ${new Date().getFullYear()} Evolvx. All rights reserved.
                  </p>
                  <p style="font-size:12px;color:${EVOLVX_BRAND.gray};margin:4px 0 0;">This is an automated message – please do not reply.</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent to:', to);
  } catch (err) {
    console.error('Error sending Evolvx email:', err.message);
  }
};

module.exports = { sendEmail };
