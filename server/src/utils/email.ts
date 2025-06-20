import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config(); 
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmailToUser(email: string, password: string) {
  const msg = {
  to: email,
  from: process.env.MAIL_USER!,
  subject: 'Welcome to Self Assesment! Your Temporary Password Inside 🚀',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border:1px solid #ddd; border-radius:8px; padding: 20px; background: #f9f9f9;">
      <div style="text-align: center;">
        <img src="https://selfassesmentapp.netlify.app/assets/Logo.svg" alt="Self Assesment Logo" style="width:120px; margin-bottom: 20px;" />
      <h2 style="color: #333;">Hello 👋</h2>
      <p style="font-size: 16px; color: #555;">
        Welcome to <strong>Self Assesment</strong>! We’re excited to have you onboard.
      </p>
      <p style="font-size: 16px; color: #555;">
        Your temporary password is:
      </p>
      <p style="font-size: 22px; font-weight: bold; color: #1a73e8; background: #e8f0fe; padding: 10px; border-radius: 5px; width: fit-content; margin: 10px auto;">
        ${password}
      </p>
      <p style="font-size: 16px; color: #555;">
        For security reasons, this password is valid for <strong>10 minutes only</strong>. Please log in and update your password immediately.
      </p>
      <a href="http://localhost:5173/" target="_blank"
         style="display: inline-block; background-color: #1a73e8; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px;">
        Log In Now
      </a>
      <p style="margin-top: 30px; font-size: 14px; color: #999;">
        If you did not request this email, please ignore it or contact support.
      </p>
    </div>
  `,
};

  await sgMail.send(msg);
}
