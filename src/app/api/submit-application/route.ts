import { NextRequest, NextResponse } from 'next/server';
import nodemailer, { SendMailOptions } from 'nodemailer';

interface ApplicationData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  educationalStatus: string;
  institutionName: string;
  fieldOfStudy: string;
  yearOfStudy: string;
  currentOccupation: string;
  relevantSkills: string;
  languagesKnown: string;
  certifications: string;
  engagementType: string;
  areaOfInterest: string;
  preferredStartDate: string;
  availability: string;
  duration: string;
  motivation: string;
  previousExperience: string;
  howDidYouHear: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;
  termsConsent: boolean;
  photoConsent: boolean;
}

// Email template styles
const getEmailStyles = () => `
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 30px;
    }
    .section {
      margin-bottom: 30px;
      background: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      border-left: 4px solid #667eea;
    }
    .section h3 {
      color: #4a5568;
      margin: 0 0 15px;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
    }
    .section-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      background: #667eea;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: bold;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .info-item {
      background: white;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .info-label {
      font-weight: 600;
      color: #4a5568;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      color: #2d3748;
      font-size: 14px;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .highlight {
      background: linear-gradient(135deg, #667eea15, #764ba215);
      border: 1px solid #667eea30;
    }
    .footer {
      background: #2d3748;
      color: white;
      padding: 25px;
      text-align: center;
    }
    .footer p {
      margin: 5px 0;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-success {
      background: #c6f6d5;
      color: #22543d;
    }
    .status-pending {
      background: #fef5e7;
      color: #744210;
    }
    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
`;

// Generate admin notification email
const generateAdminEmail = (data: ApplicationData) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Application - Jagatmitra Foundation</title>
      ${getEmailStyles()}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🌟 New Application Received</h1>
          <p>Volunteer/Internship Application</p>
          <div style="margin-top: 15px;">
            <span class="status-badge status-pending">Pending Review</span>
          </div>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 25px; color: #4a5568;">
            <strong>Application submitted on ${currentDate}</strong>
          </div>

          <div class="section">
            <h3><span class="section-icon">👤</span>Personal Information</h3>
            <div class="info-grid">
              <div class="info-item highlight">
                <div class="info-label">Full Name</div>
                <div class="info-value">${data.fullName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date of Birth</div>
                <div class="info-value">${data.dateOfBirth || 'Not provided'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Gender</div>
                <div class="info-value">${data.gender || 'Not specified'}</div>
              </div>
              <div class="info-item highlight">
                <div class="info-label">Contact Number</div>
                <div class="info-value">${data.contactNumber}</div>
              </div>
              <div class="info-item highlight full-width">
                <div class="info-label">Email Address</div>
                <div class="info-value">${data.email}</div>
              </div>
              <div class="info-item full-width">
                <div class="info-label">Address</div>
                <div class="info-value">${data.address}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3><span class="section-icon">🎓</span>Education & Background</h3>
            <div class="info-grid">
              <div class="info-item highlight">
                <div class="info-label">Educational Status</div>
                <div class="info-value">${data.educationalStatus}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Institution</div>
                <div class="info-value">${data.institutionName || 'Not provided'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Field of Study</div>
                <div class="info-value">${data.fieldOfStudy || 'Not provided'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Year of Study</div>
                <div class="info-value">${data.yearOfStudy || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3><span class="section-icon">💼</span>Professional Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Current Occupation</div>
                <div class="info-value">${data.currentOccupation || 'Not provided'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Languages Known</div>
                <div class="info-value">${data.languagesKnown || 'Not provided'}</div>
              </div>
              <div class="info-item full-width">
                <div class="info-label">Relevant Skills</div>
                <div class="info-value">${data.relevantSkills || 'Not provided'}</div>
              </div>
              <div class="info-item full-width">
                <div class="info-label">Certifications</div>
                <div class="info-value">${data.certifications || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3><span class="section-icon">🎯</span>Engagement Preferences</h3>
            <div class="info-grid">
              <div class="info-item highlight">
                <div class="info-label">Engagement Type</div>
                <div class="info-value">${data.engagementType}</div>
              </div>
              <div class="info-item highlight">
                <div class="info-label">Area of Interest</div>
                <div class="info-value">${data.areaOfInterest}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Preferred Start Date</div>
                <div class="info-value">${data.preferredStartDate || 'Flexible'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Availability</div>
                <div class="info-value">${data.availability || 'Not specified'}</div>
              </div>
              <div class="info-item full-width">
                <div class="info-label">Duration</div>
                <div class="info-value">${data.duration || 'Not specified'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3><span class="section-icon">💭</span>Motivation & Experience</h3>
            <div class="info-grid">
              <div class="info-item full-width highlight">
                <div class="info-label">Why they want to join us</div>
                <div class="info-value">${data.motivation}</div>
              </div>
              <div class="info-item full-width">
                <div class="info-label">Previous Experience</div>
                <div class="info-value">${data.previousExperience || 'No previous experience mentioned'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">How they heard about us</div>
                <div class="info-value">${data.howDidYouHear || 'Not specified'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3><span class="section-icon">🚨</span>Emergency Contact</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Contact Name</div>
                <div class="info-value">${data.emergencyContactName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Contact Phone</div>
                <div class="info-value">${data.emergencyContactPhone}</div>
              </div>
              <div class="info-item full-width">
                <div class="info-label">Relationship</div>
                <div class="info-value">${data.relationship}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3><span class="section-icon">✅</span>Consents</h3>
            <div class="info-grid">
              <div class="info-item ${data.termsConsent ? 'highlight' : ''}">
                <div class="info-label">Terms & Conditions</div>
                <div class="info-value">
                  ${data.termsConsent ? '✅ Accepted' : '❌ Not Accepted'}
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Photo/Video Usage</div>
                <div class="info-value">
                  ${data.photoConsent ? '✅ Consented' : '❌ Not Consented'}
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea15, #764ba215); border-radius: 8px;">
            <p style="margin: 0; color: #4a5568; font-weight: 600;">
              📧 Reply to this email to contact the applicant directly
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Jagatmitra Foundation</strong></p>
          <p>Admin Notification System</p>
          <p style="font-size: 12px; opacity: 0.8;">This is an automated notification</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate confirmation email for applicant
const generateConfirmationEmail = (data: ApplicationData) => {
  const applicationId = `JMF-${Date.now().toString(36).toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Received - Jagatmitra Foundation</title>
      ${getEmailStyles()}
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🎉 Application Received!</h1>
          <p>Thank you for applying to Jagatmitra Foundation</p>
          <div style="margin-top: 15px;">
            <span class="status-badge status-success">Successfully Submitted</span>
          </div>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #667eea15, #764ba215); padding: 20px; border-radius: 8px; border: 2px dashed #667eea;">
              <p style="margin: 0; font-size: 14px; color: #4a5568;">Application Reference</p>
              <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #667eea;">${applicationId}</p>
            </div>
          </div>

          <div style="background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #22543d; margin: 0 0 10px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">👋</span>
              Hello ${data.fullName}!
            </h3>
            <p style="margin: 0; color: #22543d; line-height: 1.6;">
              We have successfully received your <strong>${data.engagementType.toLowerCase()}</strong> application for <strong>${data.areaOfInterest}</strong>. 
              We're excited about your interest in making a positive impact with us!
            </p>
          </div>

          <div class="section">
            <h3><span class="section-icon">📋</span>Application Summary</h3>
            <div class="info-grid">
              <div class="info-item highlight">
                <div class="info-label">Application Type</div>
                <div class="info-value">${data.engagementType}</div>
              </div>
              <div class="info-item highlight">
                <div class="info-label">Area of Interest</div>
                <div class="info-value">${data.areaOfInterest}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Submitted On</div>
                <div class="info-value">${currentDate}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value">Under Review</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3><span class="section-icon">⏱️</span>What's Next?</h3>
            <div style="background: white; border-radius: 6px; padding: 15px;">
              <div style="display: flex; align-items: start; margin-bottom: 15px;">
                <div style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">1</div>
                <div>
                  <strong style="color: #4a5568;">Application Review</strong>
                  <p style="margin: 5px 0 0; color: #718096; font-size: 14px;">Our team will carefully review your application and qualifications.</p>
                </div>
              </div>
              <div style="display: flex; align-items: start; margin-bottom: 15px;">
                <div style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">2</div>
                <div>
                  <strong style="color: #4a5568;">Initial Screening</strong>
                  <p style="margin: 5px 0 0; color: #718096; font-size: 14px;">We may reach out for additional information or a brief interview.</p>
                </div>
              </div>
              <div style="display: flex; align-items: start;">
                <div style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">3</div>
                <div>
                  <strong style="color: #4a5568;">Final Response</strong>
                  <p style="margin: 5px 0 0; color: #718096; font-size: 14px;">You'll receive our decision within 3-5 business days.</p>
                </div>
              </div>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 8px; padding: 25px; margin: 25px 0; text-align: center;">
            <h3 style="margin: 0 0 15px; font-size: 20px;">🌟 Why Jagatmitra Foundation?</h3>
            <p style="margin: 0; opacity: 0.9; line-height: 1.6;">
              Join our mission to create lasting change through education, women empowerment, environmental conservation, and community development. Together, we can build a better world for future generations.
            </p>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px;">
            <h4 style="color: #856404; margin: 0 0 10px; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📞</span>
              Need Help?
            </h4>
            <p style="margin: 0; color: #856404; font-size: 14px;">
              If you have any questions about your application or our programs, feel free to reach out to us at 
              <strong>support@jagatmitrafoundation.com</strong> or call us at <strong>011-45653583</strong>
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Jagatmitra Foundation</strong></p>
          <p style="font-size: 14px; opacity: 0.9;">Friend of the World | Creating Sustainable Change</p>
          <div style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
            <p>📧 support@jagatmitrafoundation.com</p>
            <p>🌐 www.jagatmitrafoundation.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract and validate form data
    const data = {
      fullName: formData.get('fullName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      gender: formData.get('gender') as string,
      contactNumber: formData.get('contactNumber') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      educationalStatus: formData.get('educationalStatus') as string,
      institutionName: formData.get('institutionName') as string,
      fieldOfStudy: formData.get('fieldOfStudy') as string,
      yearOfStudy: formData.get('yearOfStudy') as string,
      currentOccupation: formData.get('currentOccupation') as string,
      relevantSkills: formData.get('relevantSkills') as string,
      languagesKnown: formData.get('languagesKnown') as string,
      certifications: formData.get('certifications') as string,
      engagementType: formData.get('engagementType') as string,
      areaOfInterest: formData.get('areaOfInterest') as string,
      preferredStartDate: formData.get('preferredStartDate') as string,
      availability: formData.get('availability') as string,
      duration: formData.get('duration') as string,
      motivation: formData.get('motivation') as string,
      previousExperience: formData.get('previousExperience') as string,
      howDidYouHear: formData.get('howDidYouHear') as string,
      emergencyContactName: formData.get('emergencyContactName') as string,
      emergencyContactPhone: formData.get('emergencyContactPhone') as string,
      relationship: formData.get('relationship') as string,
      termsConsent: formData.get('termsConsent') === 'true',
      photoConsent: formData.get('photoConsent') === 'true',
    };

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'contactNumber', 'engagementType', 'areaOfInterest', 'motivation'];
    for (const field of requiredFields) {
      if (!data[field as keyof typeof data]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Extract resume file
    const resume = formData.get('resume') as File | null;

    // Validate environment variables
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`Missing environment variable: ${envVar}`);
        return NextResponse.json(
          { message: 'Server configuration error. Please try again later.' },
          { status: 500 }
        );
      }
    }

    // Create nodemailer transporter with better error handling
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE !== 'false', // Default to true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false // For development, remove in production
      }
    });

    // Verify SMTP connection
    await transporter.verify();

    // Prepare admin notification email
    const adminMailOptions: SendMailOptions = {
      from: {
        name: 'Jagatmitra Foundation System',
        address: process.env.SMTP_USER!
      },
      to: process.env.ADMIN_EMAIL || 'jagatmitrait@gmail.com',
      subject: `🌟 New ${data.engagementType} Application - ${data.fullName}`,
      html: generateAdminEmail(data),
      replyTo: {
        name: data.fullName,
        address: data.email
      },
      priority: 'high',
    };

    // Handle resume attachment
    if (resume && resume.size > 0) {
      // Validate file size (5MB limit)
      if (resume.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: 'Resume file is too large. Please upload a file smaller than 5MB.' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(resume.type)) {
        return NextResponse.json(
          { message: 'Invalid file type. Please upload a PDF, DOC, or DOCX file.' },
          { status: 400 }
        );
      }

      const bytes = await resume.arrayBuffer();
      const buffer = Buffer.from(bytes);

      adminMailOptions.attachments = [
        {
          filename: `${data.fullName}_Resume_${resume.name}`,
          content: buffer,
          contentType: resume.type,
        },
      ];
    }

    // Send admin notification email
    await transporter.sendMail(adminMailOptions);

    // Prepare confirmation email for applicant
    const confirmationOptions: SendMailOptions = {
      from: {
        name: 'Jagatmitra Foundation',
        address: process.env.SMTP_USER!
      },
      to: {
        name: data.fullName,
        address: data.email
      },
      subject: `✅ Application Received - ${data.engagementType} Position`,
      html: generateConfirmationEmail(data),
      priority: 'normal',
    };

    // Send confirmation email
    await transporter.sendMail(confirmationOptions);

    // Log successful submission (for monitoring)
    console.log(`Application submitted successfully: ${data.fullName} - ${data.engagementType} - ${data.areaOfInterest}`);

    return NextResponse.json(
      { 
        message: 'Application submitted successfully! Check your email for confirmation.',
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing application:', error);
    
    // Return appropriate error message based on error type
    if (error instanceof Error) {
      if (error.message.includes('SMTP') || error.message.includes('authentication')) {
        return NextResponse.json(
          { message: 'Email service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { 
        message: 'Failed to submit application. Please try again or contact support.',
        success: false
      },
      { status: 500 }
    );
  }
}