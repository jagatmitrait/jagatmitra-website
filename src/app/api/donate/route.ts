import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure nodemailer transporter for Hostinger
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.hostinger.com
  port: parseInt(process.env.SMTP_PORT || '465'), // 465
  secure: process.env.SMTP_SECURE === 'true', // true for port 465
  auth: {
    user: process.env.SMTP_USER, // support@jagatmitrafoundation.com
    pass: process.env.SMTP_PASS, // Your password
  },
  // Add additional configuration for better compatibility
  connectionTimeout: 60000, // 60 seconds
  greetingTimeout: 30000, // 30 seconds
  socketTimeout: 60000, // 60 seconds
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const donationData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      identityType: formData.get('identityType') as string,
      identityNumber: formData.get('identityNumber') as string,
      donationType: formData.get('donationType') as string,
      description: formData.get('description') as string,
      pickupRequired: formData.get('pickupRequired') === 'true',
      preferredDate: formData.get('preferredDate') as string,
      preferredTime: formData.get('preferredTime') as string,
    };

    // Extract files
    const identityProof = formData.get('identityProof') as File;
    const donationImages: File[] = [];
    
    // Get all donation images
    for (let i = 0; i < 5; i++) {
      const image = formData.get(`donationImage${i}`) as File;
      if (image && image.size > 0) {
        donationImages.push(image);
      }
    }

    // Prepare attachments with proper handling
    const attachments = [];
    
    // Handle identity proof (PDF/Image) with better error handling
    if (identityProof && identityProof.size > 0) {
      try {
        const buffer = await identityProof.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);
        
        // Determine correct content type
        let contentType = identityProof.type;
        const fileName = identityProof.name.toLowerCase();
        
        if (!contentType || contentType === 'application/octet-stream') {
          if (fileName.endsWith('.pdf')) {
            contentType = 'application/pdf';
          } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
            contentType = 'image/jpeg';
          } else if (fileName.endsWith('.png')) {
            contentType = 'image/png';
          }
        }
        
        attachments.push({
          filename: identityProof.name,
          content: fileBuffer,
          contentType: contentType,
        });
        
        console.log(`✅ Identity proof processed: ${identityProof.name}, size: ${Math.round(fileBuffer.length/1024)}KB, type: ${contentType}`);
      } catch (error) {
        console.error('❌ Error processing identity proof:', error);
        // Continue without throwing - we'll send email without this attachment
      }
    } else {
      console.warn('⚠️ No identity proof file provided or file is empty');
    }

    // Handle donation images
    for (let i = 0; i < donationImages.length; i++) {
      const image = donationImages[i];
      if (image && image.size > 0) {
        try {
          const buffer = await image.arrayBuffer();
          const fileBuffer = Buffer.from(buffer);
          
          let contentType = image.type;
          const fileName = image.name.toLowerCase();
          
          if (!contentType || contentType === 'application/octet-stream') {
            if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
              contentType = 'image/jpeg';
            } else if (fileName.endsWith('.png')) {
              contentType = 'image/png';
            } else if (fileName.endsWith('.gif')) {
              contentType = 'image/gif';
            }
          }
          
          attachments.push({
            filename: image.name,
            content: fileBuffer,
            contentType: contentType,
          });
          
          console.log(`✅ Image ${i+1} processed: ${image.name}, size: ${Math.round(fileBuffer.length/1024)}KB, type: ${contentType}`);
        } catch (error) {
          console.error(`❌ Error processing donation image ${i+1}:`, error);
          // Continue with other images
        }
      }
    }

    console.log(`📎 Total attachments prepared: ${attachments.length}`);

    // Create email content with improved formatting
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #059669, #2563eb); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
          }
          .content { 
            padding: 30px 20px;
          }
          .section { 
            margin-bottom: 25px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 20px;
          }
          .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .section h3 { 
            color: #059669; 
            margin: 0 0 15px 0;
            font-size: 18px;
            display: flex;
            align-items: center;
          }
          .field { 
            margin-bottom: 8px;
            padding: 5px 0;
          }
          .field strong { 
            color: #374151;
            display: inline-block;
            min-width: 120px;
          }
          .footer { 
            background: #f9fafb; 
            padding: 20px; 
            text-align: center; 
            color: #6b7280;
            font-size: 14px;
          }
          .attachment-info {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 6px;
            padding: 10px;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎁 New Donation Request</h1>
            <p>A generous donor wants to contribute to Jagatmitra Foundation</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>👤 Personal Information</h3>
              <div class="field"><strong>Name:</strong> ${donationData.name}</div>
              <div class="field"><strong>Email:</strong> ${donationData.email}</div>
              <div class="field"><strong>Phone:</strong> ${donationData.phone}</div>
              <div class="field"><strong>Address:</strong> ${donationData.address}</div>
              <div class="field"><strong>Identity Type:</strong> ${donationData.identityType.charAt(0).toUpperCase() + donationData.identityType.slice(1).replace('_', ' ')}</div>
              <div class="field"><strong>Identity Number:</strong> ${donationData.identityNumber}</div>
            </div>

            <div class="section">
              <h3>💝 Donation Details</h3>
              <div class="field"><strong>Category:</strong> ${donationData.donationType}</div>
              <div class="field"><strong>Description:</strong></div>
              <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-top: 5px; border-left: 4px solid #059669;">
                ${donationData.description}
              </div>
            </div>

            <div class="section">
              <h3>🚚 Pickup Information</h3>
              <div class="field"><strong>Pickup Required:</strong> ${donationData.pickupRequired ? '✅ Yes' : '❌ No'}</div>
              ${donationData.pickupRequired ? `
                <div class="field"><strong>Preferred Date:</strong> ${new Date(donationData.preferredDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="field"><strong>Preferred Time:</strong> ${donationData.preferredTime}</div>
              ` : ''}
            </div>

            <div class="section">
              <h3>📎 Attachments</h3>
              <div class="field"><strong>Identity Proof:</strong> ${identityProof?.name || 'Not provided'}</div>
              <div class="field"><strong>Donation Images:</strong> ${donationImages.length} image(s) attached</div>
              
              ${attachments.length > 0 ? `
                <div class="attachment-info">
                  <strong>📋 Attached Files:</strong>
                  <ul style="margin: 5px 0; padding-left: 20px;">
                    ${attachments.map(att => `<li>${att.filename} (${att.contentType})</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>

            <div class="section">
              <h3>⏰ Submission Details</h3>
              <div class="field"><strong>Submitted On:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
              <div class="field"><strong>Request ID:</strong> DON-${Date.now()}</div>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Jagatmitra Foundation</strong></p>
            <p>This email was sent from the donation form on our website.</p>
            <p>📞 011-45653583 | 📧 support@jagatmitrafoundation.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options for admin
    const mailOptions = {
      from: `"Jagatmitra Foundation - Donation Form" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'jagatmitrait@gmail.com',
      subject: `🎁 New Donation Request: ${donationData.donationType} from ${donationData.name}`,
      html: emailHtml,
      attachments: attachments,
      replyTo: donationData.email,
    };

    console.log('📧 Sending admin notification email...');
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent successfully');

    // Send confirmation email to donor
    const confirmationEmail = {
      from: `"Jagatmitra Foundation" <${process.env.SMTP_USER}>`,
      to: donationData.email,
      subject: '🙏 Thank you for your donation to Jagatmitra Foundation',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .header { background: linear-gradient(135deg, #059669, #2563eb); color: white; padding: 30px 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
            .highlight { background: #f0f9ff; border-left: 4px solid #059669; padding: 15px; margin: 15px 0; border-radius: 0 6px 6px 0; }
            ul { padding-left: 20px; }
            .contact-info { background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🙏 Thank You for Your Generosity!</h1>
              <p>Your donation request has been received successfully</p>
            </div>
            
            <div class="content">
              <p>Dear <strong>${donationData.name}</strong>,</p>
              
              <p>Thank you for your generous donation to <strong>Jagatmitra Foundation</strong>. We have successfully received your request for donating <strong>${donationData.donationType}</strong>.</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #059669;">📋 Your Submission Summary:</h3>
                <ul>
                  <li><strong>Donation Category:</strong> ${donationData.donationType}</li>
                  <li><strong>Submission Date:</strong> ${new Date().toLocaleDateString('en-IN')}</li>
                  <li><strong>Request ID:</strong> DON-${Date.now()}</li>
                  ${donationData.pickupRequired ? `<li><strong>Pickup Requested:</strong> ${new Date(donationData.preferredDate).toLocaleDateString('en-IN')} - ${donationData.preferredTime}</li>` : ''}
                </ul>
              </div>
              
              <h3 style="color: #059669;">⏭️ What happens next?</h3>
              <ol>
                <li><strong>Review Process:</strong> Our team will review your submission within 24-48 hours</li>
                <li><strong>Verification:</strong> We may contact you to verify the donation details</li>
                <li><strong>Scheduling:</strong> ${donationData.pickupRequired ? 'We will coordinate the pickup as per your preferred schedule' : 'We will provide you with our collection center details'}</li>
                <li><strong>Collection:</strong> Your items will be collected and distributed to those in need</li>
              </ol>
              
              <div class="contact-info">
                <h4 style="margin-top: 0; color: #059669;">📞 Need Help?</h4>
                <p>If you have any questions or need to make changes to your donation request, please contact us:</p>
                <ul style="list-style: none; padding-left: 0;">
                  <li>📞 <strong>Phone:</strong> 011-45653583</li>
                  <li>📧 <strong>Email:</strong> support@jagatmitrafoundation.com</li>
                  <li>🌐 <strong>Website:</strong> www.jagatmitrafoundation.com</li>
                </ul>
              </div>
              
              <p>Your kindness and generosity help us make a meaningful impact in our community. Thank you for being a part of our mission to create positive change!</p>
              
              <p style="margin-bottom: 0;"><strong>With gratitude,</strong><br>
              <strong>The Jagatmitra Foundation Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>Jagatmitra Foundation</strong></p>
              <p>Making a difference, one donation at a time.</p>
              <p>This is an automated confirmation email. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log('📧 Sending donor confirmation email...');
    await transporter.sendMail(confirmationEmail);
    console.log('✅ Donor confirmation sent successfully');

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you! Your donation request has been submitted successfully. You will receive a confirmation email shortly.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error in donation API:', error);
    
    // More specific error handling
    let errorMessage = 'Failed to submit donation request. Please try again.';
    let debugInfo: string | undefined;
    
    if (error instanceof Error) {
      debugInfo = error.message;
      if (error.message.includes('SMTP') || error.message.includes('Mail')) {
        errorMessage = 'Email service is temporarily unavailable. Please try again later or contact us directly.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      }
    } else if (typeof error === 'string') {
      debugInfo = error;
    } else {
      debugInfo = 'Unknown error occurred';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: process.env.NODE_ENV === 'development' ? debugInfo : undefined
      },
      { status: 500 }
    );
  }
}

// Export the config for Next.js API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}