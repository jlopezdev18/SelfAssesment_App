import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { formatRteHtmlForEmail } from "./rteSanitizer";

dotenv.config();

// Professional email template with embedded logo
const getEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Self Assessment</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%); padding: 40px 20px; text-align: center;">
                            <!-- Your actual logo as embedded SVG -->
                            <div style="width: 80px; height: 80px; margin: 0 auto 20px; background-color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                <svg width="50" height="57" viewBox="0 0 473 537" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M57.6353 95.6048C177.494 95.6048 193.963 29.4736 236.051 33.1476C281.798 30.8514 283.171 89.6346 412.637 95.6048C429.106 95.6048 441 110.301 441 124.996V214.09C435.053 377.581 299.64 509.384 235.136 503.413C177.494 514.435 26.527 368.396 31.1017 211.334V122.241C32.4741 109.382 44.3685 95.6048 57.6353 95.6048Z" fill="#EDF5FF" stroke="#AADCFE" stroke-width="24"/>
                                    <path d="M41.1112 80.1607C172.111 80.1607 190.111 8.1607 236.111 12.1607C286.111 9.6607 287.611 73.6607 429.111 80.1607C447.111 80.1607 460.111 96.1607 460.111 112.161V209.161C453.611 387.161 305.611 530.661 235.111 524.16C172.111 536.161 7.11119 377.161 12.1112 206.161V109.161C13.6112 95.1607 26.6112 80.1607 41.1112 80.1607Z" stroke="#29B6F6" stroke-width="24"/>
                                    <mask id="path-3-inside-1_1_15" fill="white">
                                        <rect x="142" y="174" width="188" height="188" rx="17"/>
                                    </mask>
                                    <rect x="142" y="174" width="188" height="188" rx="17" stroke="#AADCFE" stroke-width="44" mask="url(#path-3-inside-1_1_15)"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M310.676 184.068C304.971 179.709 296.812 180.8 292.453 186.505L211.494 292.463L174.478 264.18C168.773 259.821 160.615 260.912 156.256 266.617L146.02 280.013C141.661 285.718 142.752 293.877 148.457 298.236L209.199 344.647C214.904 349.006 223.063 347.915 227.422 342.21L326.509 212.526C330.868 206.821 329.777 198.663 324.072 194.304L310.676 184.068Z" fill="#2681FF"/>
                                </svg>
                            </div>
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Self Assessment</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Professional Assessment Platform</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 15px; color: #6c757d; font-size: 14px;">
                                © 2025 Self Assessment. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #6c757d; font-size: 12px;">
                                This email was sent from an automated system. Please do not reply to this email.
                            </p>
                            <div style="margin-top: 20px;">
                                <a href="https://selfassesmentapp.netlify.app/" style="color: #20aef8; text-decoration: none; font-size: 14px; margin: 0 10px;">Visit Website</a>
                                <span style="color: #dee2e6;">|</span>
                                <a href="#" style="color: #20aef8; text-decoration: none; font-size: 14px; margin: 0 10px;">Support</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendEmailToUser(email: string, password: string) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #333; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Welcome to Self Assessment! 👋</h2>
      <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        We're excited to have you join our professional assessment platform. Your account has been created successfully.
      </p>
    </div>
    
    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #20aef8; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
      <h3 style="color: #333; margin: 0 0 15px; font-size: 18px;">Your Temporary Access Credentials</h3>
      <p style="color: #666; margin: 0 0 20px; font-size: 14px;">Please use the following temporary password to access your account:</p>
      <div style="background: white; border: 1px solid #20aef8; border-radius: 8px; padding: 20px; margin: 15px 0;">
        <p style="color: #0a94ff; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace; margin: 0; letter-spacing: 2px;">
          ${password}
        </p>
      </div>
      <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="color: #856404; margin: 0; font-size: 14px; font-weight: 500;">
          ⚠️ <strong>Security Notice:</strong> This password expires in 10 minutes for your security.
        </p>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://selfassesmentapp.netlify.app/" 
         style="display: inline-block; background: linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(32, 174, 248, 0.4);">
        🚀 Access Your Account
      </a>
    </div>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
      <h4 style="color: #333; margin: 0 0 15px; font-size: 16px;">Next Steps:</h4>
      <ol style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li>Click the "Access Your Account" button above</li>
        <li>Log in using your email and the temporary password</li>
        <li>Immediately change your password to something secure</li>
        <li>Complete your profile setup</li>
      </ol>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
      <p style="color: #999; font-size: 13px; margin: 0;">
        If you didn't request this account or have any questions, please contact our support team.
      </p>
    </div>
  `;

  const msg = {
    to: email,
    from: process.env.MAIL_USER!,
    subject: "🎉 Welcome to Self Assessment - Your Account is Ready!",
    html: getEmailTemplate(content),
  };

  await transporter.sendMail(msg);
}

export async function sendReleaseEmailToAllUsers(
  email: string | undefined,
  title: string,
  fullContent: string,
  version: string,
  tags: string[]
) {
  const formattedContent = formatRteHtmlForEmail(fullContent);

  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #333; margin: 0 0 20px; font-size: 24px; font-weight: 600;">🚀 New Release Available</h2>
      <h3 style="color: #667eea; margin: 0 0 10px; font-size: 20px; font-weight: 500;">${title}</h3>
      <p style="color: #666; font-size: 14px; margin: 0;">Version ${version}</p>
    </div>

    <div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 12px; padding: 30px; margin: 30px 0;">
      <div style="color: #333; font-size: 15px; line-height: 1.7;">
        ${formattedContent}
      </div>
    </div>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
      <h4 style="color: #333; margin: 0 0 15px; font-size: 16px;">Release Information:</h4>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="color: #20aef8; font-weight: 600; min-width: 80px;">Version:</span>
          <span style="color: #666; font-family: 'Courier New', monospace;">${version}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="color: #20aef8; font-weight: 600; min-width: 80px;">Tags:</span>
          <span style="color: #666;">${tags.join(", ")}</span>
        </div>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://selfassesmentapp.netlify.app/" 
         style="display: inline-block; background: linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(32, 174, 248, 0.4);">
        🌟 Explore New Features
      </a>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
      <p style="color: #999; font-size: 13px; margin: 0;">
        Thank you for being part of our community! We hope you enjoy the new features and improvements.
      </p>
    </div>
  `;

  const msg = {
    to: email,
    from: process.env.MAIL_USER!,
    subject: `🚀 New Release: ${title}`,
    html: getEmailTemplate(content),
  };

  await transporter.sendMail(msg);
}

export async function sendEmailToMainUser(email: string, password: string) {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #333; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Welcome to Self Assessment! 🎉</h2>
      <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
        Welcome to Self Assessment! Your main account has been created successfully and you're ready to get started.
      </p>
    </div>
    
    <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 2px solid #20aef8; border-radius: 12px; padding: 30px; margin: 30px 0; text-align: center;">
      <h3 style="color: #333; margin: 0 0 15px; font-size: 18px;">🔐 Your Account Credentials</h3>
      <p style="color: #666; margin: 0 0 20px; font-size: 14px;">Use these credentials to access your account:</p>
      <div style="background: white; border: 1px solid #20aef8; border-radius: 8px; padding: 20px; margin: 15px 0;">
        <p style="color: #0a94ff; font-size: 24px; font-weight: bold; font-family: 'Courier New', monospace; margin: 0; letter-spacing: 2px;">
          ${password}
        </p>
      </div>
      <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 15px; margin: 20px 0;">
        <p style="color: #856404; margin: 0; font-size: 14px; font-weight: 500;">
          ⚠️ <strong>Security Notice:</strong> Please change this password immediately after login.
        </p>
      </div>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://selfassesmentapp.netlify.app/" 
         style="display: inline-block; background: linear-gradient(90deg, rgba(32, 174, 248, 1) 0%, rgba(10, 148, 255, 1) 54%, rgba(143, 207, 255, 1) 100%); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(32, 174, 248, 0.4);">
        � Access Your Account
      </a>
    </div>

    <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
      <h4 style="color: #333; margin: 0 0 15px; font-size: 16px;">Get Started:</h4>
      <ol style="color: #666; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
        <li>Click the "Access Your Account" button above</li>
        <li>Log in using your email and the temporary password</li>
        <li>Change your password to something secure</li>
        <li>Complete your profile setup</li>
        <li>Start exploring the platform features</li>
      </ol>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
      <p style="color: #999; font-size: 13px; margin: 0;">
        Thank you for choosing Self Assessment! We're here to help you succeed with our platform.
      </p>
    </div>
  `;

  const msg = {
    to: email,
    from: process.env.MAIL_USER!,
    subject: "🎉 Welcome to Self Assessment - Your Account is Ready!",
    html: getEmailTemplate(content),
  };

  await transporter.sendMail(msg);
}
