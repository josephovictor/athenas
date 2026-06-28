import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email invitation template
export const sendInvitationEmail = async ({
  email,
  name,
  role,
  temporaryPassword,
  loginUrl,
}: {
  email: string;
  name: string;
  role: string;
  temporaryPassword: string;
  loginUrl: string;
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Athenas System <onboarding@resend.dev>',
      to: [email],
      subject: `Welcome to Athenas - Your ${role} Account is Ready`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .credentials {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #2dd4bf;
              }
              .credential-item {
                margin: 10px 0;
              }
              .credential-label {
                font-weight: bold;
                color: #0d9488;
              }
              .password {
                font-family: monospace;
                background: #f3f4f6;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 16px;
              }
              .button {
                display: inline-block;
                background: #0d9488;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
                font-weight: bold;
              }
              .button:hover {
                background: #0f766e;
              }
              .warning {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                color: #6b7280;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎓 Welcome to Athenas</h1>
              <p>Your account has been created</p>
            </div>
            
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>You have been added to the Athenas platform as a <strong>${role}</strong>. 
              Your account is now ready to use.</p>
              
              <div class="credentials">
                <h3 style="margin-top: 0; color: #0d9488;">🔐 Your Login Credentials</h3>
                
                <div class="credential-item">
                  <span class="credential-label">Email:</span> ${email}
                </div>
                
                <div class="credential-item">
                  <span class="credential-label">Temporary Password:</span> 
                  <span class="password">${temporaryPassword}</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to Athenas</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important Security Notice:</strong><br>
                For your security, you will be required to change your password 
                immediately after your first login.
              </div>
              
              <p>If you have any questions or need assistance, please contact 
              your system coordinator.</p>
              
              <div class="footer">
                <p>This email was sent by Athenas Management System</p>
                <p>&copy; ${new Date().getFullYear()} Athenas. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send invitation email');
    }

    console.log('Invitation email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};