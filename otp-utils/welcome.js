const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

const EVOLVX_SUPPORT_EMAIL = 'evolvx.org@gmail.com'; // Replace with real support email

const EVOLVX_BRAND = {
  primary: '#FF6B00',     // Bright Orange
  accent: '#FDCB06',      // Yellow Accent
  dark: '#0D1B2A',        // Deep Blue
  white: '#FFFFFF',
  text: '#1f2937',         // Slate
  gray: '#6b7280'
};

const sendWelcomeEmail = async (to, userName = '') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
      user: process.env.EVOLVX_EMAIL_USER, // Add this to your .env
      pass: process.env.EVOLVX_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Evolvx <${EVOLVX_SUPPORT_EMAIL}>`,
    to: to,
    subject: `Welcome to Evolvx – Your Journey Starts Here!`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Welcome to Evolvx</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
          background-color: ${EVOLVX_BRAND.dark};
          color: ${EVOLVX_BRAND.white};
        }
      </style>
    </head>
    <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${EVOLVX_BRAND.dark}; padding: 50px 0;">
        <tr>
          <td align="center">
            <table width="100%" style="max-width:600px; background-color:${EVOLVX_BRAND.white}; border-radius:12px; overflow:hidden; box-shadow:0 0 20px rgba(0,0,0,0.1);" cellpadding="0" cellspacing="0">
              
              <!-- Header -->
              <tr>
                <td style="padding: 24px 40px; background: linear-gradient(90deg, ${EVOLVX_BRAND.primary}, ${EVOLVX_BRAND.accent}); text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: ${EVOLVX_BRAND.white}; letter-spacing: 1px;">
                    Welcome to <span style="color: ${EVOLVX_BRAND.accent};">EVOLVX</span>
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px; text-align: center; background-color: ${EVOLVX_BRAND.white};">
                  <h2 style="font-size: 24px; font-weight: 600; color: ${EVOLVX_BRAND.primary}; margin-bottom: 16px;">
                    Hello${userName ? `, ${userName}` : ""} 👋
                  </h2>
                  <p style="font-size: 16px; color: ${EVOLVX_BRAND.text}; line-height: 1.6;">
                    You’ve just joined an exciting journey into the world of innovation, leadership, and entrepreneurship.
                    EVOLVX empowers students like you to solve real-world problems using creativity, coding, and curiosity 🚀
                  </p>

                  <ul style="max-width: 420px; margin: 30px auto; text-align: left; font-size: 16px; color: ${EVOLVX_BRAND.primary}; line-height: 1.6;">
                    <li>🏆 Participate in real-world challenges</li>
                    <li>🌱 Grow through mentoring and bootcamps</li>
                    <li>💡 Learn by building—step by step</li>
                    <li>🎤 Pitch your ideas and become a future innovator</li>
                  </ul>

                  <!-- CTA Button -->
                  <div style="margin: 40px 0;">
                    <a href="https://evolvx.org.in" style="background: ${EVOLVX_BRAND.primary}; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
                      Get Started →
                    </a>
                  </div>

                  <p style="font-size: 14px; color: ${EVOLVX_BRAND.gray};">
                    Questions? Reach our <a href="mailto:${EVOLVX_SUPPORT_EMAIL}" style="color: ${EVOLVX_BRAND.primary}; text-decoration: none;">support team</a>.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; text-align: center; background-color: ${EVOLVX_BRAND.dark};">
                  <p style="font-size: 12px; color: ${EVOLVX_BRAND.gray}; margin: 0 0 6px;">
                    You’re receiving this email because you registered at <a href="https://evolvx.org.in" target="_blank" style="color: ${EVOLVX_BRAND.accent}; text-decoration: none;">evolvx.org.in</a>
                  </p>
                   <p style="font-size: 12px; color: ${EVOLVX_BRAND.gray}; margin: 0 0 6px;">
                    EVOLVX is Marketed by Kreatenow — Kreatenow.in
                  </p>
                  <p style="font-size: 12px; color: ${EVOLVX_BRAND.gray}; margin: 0 0 6px;">
                    EVOLVX is powered by Scasys Technologies — <a href="https://scasys.in" style="color: ${EVOLVX_BRAND.accent}; text-decoration: none;">scasys.in</a>
                  </p>
                  <p style="font-size: 11px; color: ${EVOLVX_BRAND.primary}; margin-top: 10px;">
                    Let’s build the future, one idea at a time.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Evolvx Welcome Email sent to: ${to}`)
  } catch (err) {
    console.error("Evolvx Welcome Email Failed:", err)
  }
}

module.exports = { sendWelcomeEmail }
