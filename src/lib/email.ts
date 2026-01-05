/**
 * Email Utility
 * 
 * Handles email notifications using Resend.
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'ScopeSite Digital Studios <noreply@scopesite.co.uk>';
const ADMIN_EMAIL = 'dan@scopesite.co.uk';

export interface BriefEmailData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  project_type: string;
  budget_range?: string;
  timeline?: string;
  description: string;
  file_urls?: string[];
  referral_source?: string;
}

/**
 * Send notification email to admin when new brief is submitted
 */
export async function sendAdminNotification(brief: BriefEmailData): Promise<boolean> {
  const subject = `New Brief: ${brief.company || brief.name} - ${brief.project_type}`;

  const fileList = brief.file_urls?.length
    ? brief.file_urls
        .map((url, i) => `<li><a href="${url}" style="color: #ECB615;">Attachment ${i + 1}</a></li>`)
        .join('')
    : '<li style="color: #666;">No files attached</li>';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #0A1B36; padding: 24px; text-align: center;">
          <h1 style="color: #ECB615; margin: 0; font-size: 24px; font-weight: bold;">NEW BRIEF SUBMITTED</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          
          <!-- Contact Info -->
          <div style="margin-bottom: 24px; padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
            <h2 style="color: #0A1B36; margin: 0 0 12px 0; font-size: 18px;">Contact Information</h2>
            <p style="margin: 4px 0; color: #333;"><strong>Name:</strong> ${brief.name}</p>
            <p style="margin: 4px 0; color: #333;"><strong>Email:</strong> <a href="mailto:${brief.email}" style="color: #ECB615;">${brief.email}</a></p>
            ${brief.company ? `<p style="margin: 4px 0; color: #333;"><strong>Company:</strong> ${brief.company}</p>` : ''}
            ${brief.phone ? `<p style="margin: 4px 0; color: #333;"><strong>Phone:</strong> <a href="tel:${brief.phone}" style="color: #ECB615;">${brief.phone}</a></p>` : ''}
          </div>
          
          <!-- Project Details -->
          <div style="margin-bottom: 24px; padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
            <h2 style="color: #0A1B36; margin: 0 0 12px 0; font-size: 18px;">Project Details</h2>
            <p style="margin: 4px 0; color: #333;"><strong>Type:</strong> ${brief.project_type}</p>
            ${brief.budget_range ? `<p style="margin: 4px 0; color: #333;"><strong>Budget:</strong> ${brief.budget_range}</p>` : ''}
            ${brief.timeline ? `<p style="margin: 4px 0; color: #333;"><strong>Timeline:</strong> ${brief.timeline}</p>` : ''}
            ${brief.referral_source ? `<p style="margin: 4px 0; color: #333;"><strong>Referral Source:</strong> ${brief.referral_source}</p>` : ''}
          </div>
          
          <!-- Description -->
          <div style="margin-bottom: 24px;">
            <h2 style="color: #0A1B36; margin: 0 0 12px 0; font-size: 18px;">Project Description</h2>
            <div style="padding: 16px; background-color: #0A1B36; border-radius: 8px; color: #ffffff; line-height: 1.6;">
              ${brief.description.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <!-- Files -->
          <div style="margin-bottom: 24px;">
            <h2 style="color: #0A1B36; margin: 0 0 12px 0; font-size: 18px;">Attached Files</h2>
            <ul style="margin: 0; padding-left: 20px; color: #333;">
              ${fileList}
            </ul>
          </div>
          
          <!-- Action Button -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:${brief.email}?subject=Re: Your Brief Submission - ScopeSite Digital Studios" 
               style="display: inline-block; padding: 12px 32px; background-color: #ECB615; color: #0A1B36; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Reply to ${brief.name}
            </a>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background-color: #0A1B36; padding: 16px; text-align: center;">
          <p style="margin: 0; color: #ffffff; font-size: 12px;">
            Submitted via scopesite.co.uk/brief
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
      replyTo: brief.email,
    });
    return true;
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return false;
  }
}

/**
 * Send confirmation email to client
 */
export async function sendClientConfirmation(brief: BriefEmailData): Promise<boolean> {
  const subject = "We've received your brief - ScopeSite Digital Studios";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #0A1B36; padding: 32px; text-align: center;">
          <h1 style="color: #ECB615; margin: 0; font-size: 28px; font-weight: bold;">THANK YOU!</h1>
          <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 16px;">We've received your project brief</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px;">
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            Hi ${brief.name.split(' ')[0]},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            Thanks for sending us your brief! We're excited to learn more about your project.
          </p>
          
          <!-- Summary Box -->
          <div style="margin: 24px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #ECB615;">
            <h2 style="color: #0A1B36; margin: 0 0 12px 0; font-size: 16px;">Your Brief Summary</h2>
            <p style="margin: 4px 0; color: #666;"><strong>Project Type:</strong> ${brief.project_type}</p>
            ${brief.budget_range ? `<p style="margin: 4px 0; color: #666;"><strong>Budget Range:</strong> ${brief.budget_range}</p>` : ''}
            ${brief.timeline ? `<p style="margin: 4px 0; color: #666;"><strong>Timeline:</strong> ${brief.timeline}</p>` : ''}
          </div>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            <strong>What happens next?</strong>
          </p>
          
          <ul style="color: #333; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0; padding-left: 20px;">
            <li>We'll review your brief within <strong>2 business days</strong></li>
            <li>You'll receive a tailored response from Dan Cartwright, our director</li>
            <li>If we're a good fit, we'll suggest next steps or schedule a call</li>
          </ul>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
            In the meantime, feel free to check out our recent work on our website or connect with us on LinkedIn.
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://scopesite.co.uk/book" 
               style="display: inline-block; padding: 14px 32px; background-color: #ECB615; color: #0A1B36; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Book a Call Now
            </a>
            <p style="color: #666; font-size: 14px; margin: 8px 0 0 0;">
              Want to skip ahead? Schedule a free strategy call.
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background-color: #0A1B36; padding: 24px; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 14px; font-weight: bold;">
            ScopeSite Digital Studios
          </p>
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 12px;">
            Veteran-owned • Somerset, UK
          </p>
          <p style="margin: 0; color: #666; font-size: 12px;">
            <a href="https://scopesite.co.uk" style="color: #ECB615;">scopesite.co.uk</a> • 
            <a href="tel:+441373311339" style="color: #ECB615;">01373 311 339</a>
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: brief.email,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send client confirmation:', error);
    return false;
  }
}

