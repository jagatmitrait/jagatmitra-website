import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure nodemailer transporter optimized for Hostinger
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'true', // Use your env variable
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Optimized settings for Hostinger SMTP
  pool: true,
  maxConnections: 3, // Reduced for shared hosting
  maxMessages: 50,   // Reduced for shared hosting
  rateLimit: 5,      // Reduced to prevent rate limiting
  connectionTimeout: 15000, // 15 seconds for slower shared hosting
  greetingTimeout: 10000,   // 10 seconds
  socketTimeout: 45000,     // 45 seconds for reliability
  // Additional Hostinger-specific settings
  requireTLS: true,
  tls: {
    rejectUnauthorized: false // Sometimes needed for shared hosting
  }
});

export async function POST(request: NextRequest) {
  // Add timeout for the entire request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Email to foundation
    const foundationEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { 
            background: linear-gradient(135deg, #4f46e5, #7c3aed); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .section { margin-bottom: 25px; }
          .section h3 { 
            color: #4f46e5; 
            border-bottom: 2px solid #4f46e5; 
            padding-bottom: 8px; 
            margin-bottom: 15px;
          }
          .field { 
            margin-bottom: 12px; 
            padding: 10px; 
            background: #f8fafc; 
            border-radius: 6px;
            border-left: 4px solid #4f46e5;
          }
          .field strong { color: #374151; }
          .message-box { 
            background: #f1f5f9; 
            padding: 20px; 
            border-radius: 8px; 
            border-left: 4px solid #7c3aed;
            font-style: italic;
          }
          .footer { 
            background: #f9fafb; 
            padding: 20px; 
            border-radius: 0 0 8px 8px; 
            text-align: center; 
            color: #6b7280; 
            border-top: 1px solid #e5e7eb;
          }
          .badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 New Contact Form Submission</h1>
            <p>Someone has reached out through your website</p>
            <span class="badge">Subject: ${subject}</span>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>👤 Contact Information</h3>
              <div class="field"><strong>Name:</strong> ${name}</div>
              <div class="field"><strong>Email:</strong> ${email}</div>
              <div class="field"><strong>Subject Category:</strong> ${subject}</div>
            </div>

            <div class="section">
              <h3>💬 Message</h3>
              <div class="message-box">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div class="section">
              <h3>📋 Next Steps</h3>
              <p>Please respond to this inquiry within 24-48 hours. You can reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from the Jagatmitra Foundation contact form.</p>
            <p>Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Simplified confirmation email template (smaller HTML = faster)
    const confirmationEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { 
            background: linear-gradient(135deg, #059669, #2563eb); 
            color: white; 
            padding: 20px; 
            text-align: center;
          }
          .content { padding: 20px; }
          .highlight { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { background: #f9fafb; padding: 15px; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Thank You!</h1>
            <p>We've received your message</p>
          </div>
          
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for contacting Jagatmitra Foundation regarding <strong>"${subject}"</strong>.</p>
            
            <div class="highlight">
              <p><strong>✅ What happens next?</strong></p>
              <p>Our team will respond within 24-48 hours.</p>
            </div>
            
            <p><strong>Need immediate help?</strong><br>
            📧 support@jagatmitrafoundation.com<br>
            📞 011-45653583</p>
            
            <p>Best regards,<br><strong>Jagatmitra Foundation Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This is an automated confirmation from Jagatmitra Foundation.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send both emails in parallel with proper error handling
    const [foundationResult, confirmationResult] = await Promise.allSettled([
      transporter.sendMail({
        from: `"${name}" <${process.env.SMTP_USER}>`,
        to: 'support@jagatmitrafoundation.com',
        subject: `Contact Form - ${subject} from ${name}`,
        html: foundationEmailHtml,
        replyTo: email,
      }),
      
      transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Thank you for contacting Jagatmitra Foundation',
        html: confirmationEmailHtml,
      })
    ]);
    
    // Check results
    let foundationSuccess = false;
    let confirmationSuccess = false;
    
    if (foundationResult.status === 'fulfilled') {
      foundationSuccess = true;
      console.log('Foundation email sent:', foundationResult.value.messageId);
    } else {
      console.error('Foundation email failed:', foundationResult.reason);
    }
    
    if (confirmationResult.status === 'fulfilled') {
      confirmationSuccess = true;
      console.log('Confirmation email sent:', confirmationResult.value.messageId);
    } else {
      console.error('Confirmation email failed:', confirmationResult.reason);
    }

    // If foundation email failed, return error
    if (!foundationSuccess) {
      throw new Error('Failed to send notification to foundation');
    }

    // Return success even if confirmation email fails (not critical)
    const responseMessage = confirmationSuccess 
      ? 'Message sent successfully! Check your email for confirmation.'
      : 'Message sent successfully! We will respond within 24-48 hours.';

    clearTimeout(timeoutId);
    return NextResponse.json({ success: true, message: responseMessage }, { status: 200 });

  } catch (error: unknown) {
    clearTimeout(timeoutId);
    console.error('Error sending contact email:', error);
    
    // More specific error handling for Hostinger/shared hosting issues
    let errorMessage = 'Failed to send message. Please try again or contact us directly.';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      }
    }
    
    // Handle nodemailer specific errors
    if (typeof error === 'object' && error !== null) {
      const nodeError = error as Record<string, unknown>;
      if (nodeError.code === 'EAUTH') {
        errorMessage = 'Email authentication failed. Please contact support.';
      } else if (nodeError.code === 'ECONNECTION' || nodeError.code === 'ENOTFOUND') {
        errorMessage = 'Connection failed. Please check your internet and try again.';
      } else if (nodeError.code === 'ETIMEDOUT') {
        errorMessage = 'Request timed out. Please try again.';
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage
      },
      { status: 500 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
