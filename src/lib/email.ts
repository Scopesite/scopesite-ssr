/**
 * Email Utility
 * 
 * Handles email notifications using Brevo (formerly Sendinblue).
 */

import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

const FROM_EMAIL = 'noreply@scopesite.co.uk';
const FROM_NAME = 'ScopeSite Digital Studios';
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

  const htmlContent = `
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
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: ADMIN_EMAIL, name: 'Dan Cartwright' }];
    sendSmtpEmail.replyTo = { email: brief.email, name: brief.name };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
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

  const htmlContent = `
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
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: brief.email, name: brief.name }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    console.error('Failed to send client confirmation:', error);
    return false;
  }
}

// ============================================
// QUOTE EMAIL FUNCTIONS
// ============================================

export interface QuoteEmailData {
  quoteId: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  message?: string;
  projectType: string;
  packageType: string;
  paymentType: string;
  selectedTotal: number;
  monthlyPayment?: number | null;
  quoteUrl: string;
  locale?: 'uk' | 'us';
}

function formatCurrency(amount: number, locale?: 'uk' | 'us'): string {
  if (locale === 'us') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Send notification email to admin when quote is submitted
 */
export async function sendQuoteAdminNotification(quote: QuoteEmailData): Promise<boolean> {
  const loc = quote.locale || 'uk';
  const currencyNote = loc === 'us' ? ' [US/USD]' : '';
  const subject = `New Quote${currencyNote}: ${quote.company || quote.name} - ${quote.packageType} (${formatCurrency(quote.selectedTotal, loc)})`;

  const htmlContent = `
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
          <h1 style="color: #ECB615; margin: 0; font-size: 24px; font-weight: bold;">NEW QUOTE SUBMITTED</h1>
          <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px;">Quote ID: ${quote.quoteId}</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          
          <!-- Pricing Summary (highlighted) -->
          <div style="margin-bottom: 24px; padding: 20px; background-color: #ECB615; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #0A1B36; font-size: 14px; font-weight: bold;">TOTAL VALUE${loc === 'us' ? ' (USD)' : ''}</p>
            <p style="margin: 0; color: #0A1B36; font-size: 32px; font-weight: bold;">${formatCurrency(quote.selectedTotal, loc)}</p>
            ${quote.monthlyPayment ? `<p style="margin: 8px 0 0 0; color: #0A1B36; font-size: 14px;">${formatCurrency(quote.monthlyPayment, loc)}/month (${quote.paymentType})</p>` : `<p style="margin: 8px 0 0 0; color: #0A1B36; font-size: 14px;">${quote.paymentType}</p>`}
          </div>
          
          <!-- Contact Info -->
          <div style="margin-bottom: 24px; padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
            <h2 style="color: #0A1B36; margin: 0 0 12px 0; font-size: 18px;">Contact Information</h2>
            <p style="margin: 4px 0; color: #333;"><strong>Name:</strong> ${quote.name}</p>
            <p style="margin: 4px 0; color: #333;"><strong>Email:</strong> <a href="mailto:${quote.email}" style="color: #ECB615;">${quote.email}</a></p>
            ${quote.company ? `<p style="margin: 4px 0; color: #333;"><strong>Company:</strong> ${quote.company}</p>` : ''}
            ${quote.phone ? `<p style="margin: 4px 0; color: #333;"><strong>Phone:</strong> <a href="tel:${quote.phone}" style="color: #ECB615;">${quote.phone}</a></p>` : ''}
          </div>
          
          <!-- Project Details -->
          <div style="margin-bottom: 24px; padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
            <h2 style="color: #0A1B36; margin: 0 0 12px 0; font-size: 18px;">Project Details</h2>
            <p style="margin: 4px 0; color: #333;"><strong>Project Type:</strong> ${quote.projectType}</p>
            <p style="margin: 4px 0; color: #333;"><strong>Package:</strong> ${quote.packageType}</p>
            <p style="margin: 4px 0; color: #333;"><strong>Payment Plan:</strong> ${quote.paymentType}</p>
          </div>
          
          ${quote.message ? `
          <!-- Message -->
          <div style="margin-bottom: 24px;">
            <h2 style="color: #0A1B36; margin: 0 0 12px 0; font-size: 18px;">Additional Notes</h2>
            <div style="padding: 16px; background-color: #0A1B36; border-radius: 8px; color: #ffffff; line-height: 1.6;">
              ${quote.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          ` : ''}
          
          <!-- Action Buttons -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="${quote.quoteUrl}" 
               style="display: inline-block; padding: 12px 24px; background-color: #0A1B36; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 12px;">
              View Full Quote
            </a>
            <a href="mailto:${quote.email}?subject=Re: Your ScopeSite Quote (${quote.quoteId})" 
               style="display: inline-block; padding: 12px 24px; background-color: #ECB615; color: #0A1B36; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Reply to ${quote.name.split(' ')[0]}
            </a>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background-color: #0A1B36; padding: 16px; text-align: center;">
          <p style="margin: 0; color: #ffffff; font-size: 12px;">
            Submitted via scopesite.co.uk/pricing
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: ADMIN_EMAIL, name: 'Dan Cartwright' }];
    sendSmtpEmail.replyTo = { email: quote.email, name: quote.name };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[Email] Admin notification sent for quote ${quote.quoteId}`);
    return true;
  } catch (error) {
    console.error('Failed to send quote admin notification:', error);
    return false;
  }
}

/**
 * Send confirmation email to client when quote is submitted
 */
export async function sendQuoteClientConfirmation(quote: QuoteEmailData): Promise<boolean> {
  const loc = quote.locale || 'uk';
  const firstName = quote.name.split(' ')[0] || 'there';
  const subject = `Your quote's in, ${firstName}`;

  const htmlContent = `
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
          <h1 style="color: #ECB615; margin: 0; font-size: 28px; font-weight: bold;">Your Quote is Ready</h1>
          <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px; opacity: 0.8;">Reference: ${quote.quoteId}</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px;">
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            Hi ${firstName},
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            <strong>Good news: I've got a price for you.</strong>
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.7; margin: 0 0 24px 0;">
            Before we get to that, a quick word from me. I'm Dan Cartwright, the founder of ScopeSite and the one who'll be handling your project personally. I'm a former Army Signals guy, and I run things here the same way: clear communication, no fluff, and we deliver what we promise.
          </p>
          
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
            <strong>Here's your quote:</strong>
          </p>
          
          <!-- Quote Summary Box -->
          <div style="margin: 24px 0; padding: 28px; background-color: #0A1B36; border-radius: 12px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Your ${quote.packageType}</p>
            <p style="margin: 0 0 8px 0; color: #ECB615; font-size: 42px; font-weight: bold;">${formatCurrency(quote.selectedTotal, loc)}</p>
            ${quote.monthlyPayment ? `
            <p style="margin: 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
              (or ${formatCurrency(quote.monthlyPayment, loc)}/month over ${quote.paymentType})
            </p>
            ` : `
            <p style="margin: 0; color: #ffffff; font-size: 16px; opacity: 0.9;">${quote.paymentType}</p>
            `}
          </div>
          
          <!-- Project Details -->
          <div style="margin: 24px 0; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #ECB615;">
            <p style="margin: 4px 0; color: #555;"><strong style="color: #0A1B36;">Project Type:</strong> ${quote.projectType}</p>
            <p style="margin: 4px 0; color: #555;"><strong style="color: #0A1B36;">Package:</strong> ${quote.packageType}</p>
            <p style="margin: 4px 0; color: #555;"><strong style="color: #0A1B36;">Payment Plan:</strong> ${quote.paymentType}</p>
          </div>
          
          <!-- Value Proposition -->
          <div style="margin: 28px 0; padding: 24px; background-color: #FEF9E7; border-radius: 8px; border: 1px solid #ECB615;">
            <p style="color: #0A1B36; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0;">
              <strong>What this actually means for your business:</strong>
            </p>
            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 12px 0;">
              This isn't just a website. It's designed from the ground up so that when potential customers ask ChatGPT, Perplexity, or Google for a recommendation in your field, <strong>your business is the name that comes up</strong>.
            </p>
            <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0;">
              That's what AI visibility gets you: becoming the recommended answer, not just another search result.
            </p>
          </div>
          
          <!-- What happens now -->
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 12px 0;">
            <strong>What happens now?</strong>
          </p>
          
          <p style="color: #333; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
            I'll personally review the details you submitted and reach out within 24 hours. If you want to skip the back-and-forth and get straight into it, grab a slot on my calendar.
          </p>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://scopesite.co.uk/book?email=${encodeURIComponent(quote.email)}" 
               style="display: inline-block; padding: 16px 36px; background-color: #ECB615; color: #0A1B36; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Book a 15-Minute Call with Dan
            </a>
            <p style="color: #666; font-size: 14px; margin: 12px 0 0 0;">
              No sales pitch. Just a direct conversation about your project.
            </p>
          </div>
          
          <!-- Quote validity notice -->
          <div style="margin: 28px 0; padding: 16px; background-color: #f8f9fa; border-radius: 6px; text-align: center;">
            <p style="color: #666; font-size: 13px; line-height: 1.6; margin: 0;">
              This quote is valid for <strong>7 days</strong>. Pricing may be different after this period.<br/>
              I take on a limited number of projects each quarter to ensure every client gets my direct attention.
            </p>
          </div>
          
          <!-- View quote link -->
          <div style="text-align: center; margin: 24px 0;">
            <a href="${quote.quoteUrl}" 
               style="color: #ECB615; font-size: 14px; text-decoration: underline;">
              View your quote online
            </a>
          </div>
          
          <!-- Sign off -->
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
            <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0 0 4px 0;">
              ${loc === 'us' ? 'Best,' : 'Cheers,'}
            </p>
            <p style="color: #0A1B36; font-size: 16px; font-weight: bold; margin: 0 0 4px 0;">
              Dan Cartwright
            </p>
            <p style="color: #666; font-size: 14px; margin: 0;">
              Founder, ScopeSite Digital Studios
            </p>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background-color: #0A1B36; padding: 24px; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #ECB615; font-size: 14px; font-weight: bold;">
            ScopeSite Digital Studios
          </p>
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 12px;">
            Veteran-owned ${loc === 'us' ? '• UK-based, serving US businesses' : '• Somerset, UK'}
          </p>
          ${loc === 'us' ? `
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 12px;">
            All prices are in USD.
          </p>
          ` : ''}
          <p style="margin: 0; font-size: 12px;">
            <a href="https://scopesite.co.uk" style="color: #ECB615;">scopesite.co.uk</a>
            <span style="color: #ffffff; margin: 0 8px;">|</span>
            <a href="tel:+441373311339" style="color: #ECB615;">01373 311 339</a>
          </p>
          ${loc === 'us' ? `
          <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 11px; opacity: 0.6;">
            We accommodate all US time zones for calls and meetings.
          </p>
          ` : ''}
        </div>
        
      </div>
    </body>
    </html>
  `;

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: quote.email, name: quote.name }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[Email] Client confirmation sent for quote ${quote.quoteId} to ${quote.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send quote client confirmation:', error);
    return false;
  }
}

// ============================================
// SPEED TEST LEAD CAPTURE
// ============================================

export interface SpeedTestLeadData {
  url: string;
  performanceScore: number;
  fcp: number;
  lcp: number;
  ttfb: number;
  cls: number;
}

/**
 * Send speed test lead notification to admin (silent capture)
 */
export async function sendSpeedTestLeadNotification(lead: SpeedTestLeadData): Promise<boolean> {
  // Determine urgency based on score
  const urgency = lead.performanceScore < 50 
    ? '🔴 HOT LEAD' 
    : lead.performanceScore < 70 
      ? '🟠 WARM LEAD' 
      : '🟢 LEAD';
  
  const subject = `${urgency}: Speed Test - ${lead.url} (Score: ${lead.performanceScore}/100)`;

  // Extract domain for Apollo lookup hint
  const domain = new URL(lead.url).hostname.replace('www.', '');

  const htmlContent = `
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
          <h1 style="color: #ECB615; margin: 0; font-size: 24px; font-weight: bold;">SPEED TEST LEAD</h1>
          <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px;">${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          
          <!-- URL & Score -->
          <div style="margin-bottom: 24px; padding: 20px; background-color: ${lead.performanceScore < 50 ? '#FEE2E2' : lead.performanceScore < 70 ? '#FEF3C7' : '#D1FAE5'}; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #0A1B36; font-size: 14px; font-weight: bold;">WEBSITE TESTED</p>
            <p style="margin: 0 0 12px 0; color: #0A1B36; font-size: 18px; font-weight: bold;">
              <a href="${lead.url}" style="color: #0A1B36;">${lead.url}</a>
            </p>
            <p style="margin: 0; font-size: 48px; font-weight: bold; color: ${lead.performanceScore < 50 ? '#DC2626' : lead.performanceScore < 70 ? '#D97706' : '#059669'};">
              ${lead.performanceScore}<span style="font-size: 24px;">/100</span>
            </p>
          </div>
          
          <!-- Metrics -->
          <div style="margin-bottom: 24px; padding: 16px; background-color: #f8f9fa; border-radius: 8px;">
            <h2 style="color: #0A1B36; margin: 0 0 16px 0; font-size: 18px;">Performance Metrics</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;">First Contentful Paint</td>
                <td style="padding: 8px 0; color: ${lead.fcp > 2 ? '#DC2626' : '#059669'}; font-weight: bold; text-align: right; border-bottom: 1px solid #eee;">${lead.fcp}s</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;">Largest Contentful Paint</td>
                <td style="padding: 8px 0; color: ${lead.lcp > 2.5 ? '#DC2626' : '#059669'}; font-weight: bold; text-align: right; border-bottom: 1px solid #eee;">${lead.lcp}s</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; border-bottom: 1px solid #eee;">Time to First Byte</td>
                <td style="padding: 8px 0; color: ${lead.ttfb > 200 ? '#DC2626' : '#059669'}; font-weight: bold; text-align: right; border-bottom: 1px solid #eee;">${lead.ttfb}ms</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Layout Shift</td>
                <td style="padding: 8px 0; color: ${lead.cls > 0.1 ? '#DC2626' : '#059669'}; font-weight: bold; text-align: right;">${lead.cls}</td>
              </tr>
            </table>
          </div>
          
          <!-- Apollo Hint -->
          <div style="margin-bottom: 24px; padding: 16px; background-color: #EEF2FF; border-radius: 8px; border-left: 4px solid #6366F1;">
            <p style="margin: 0 0 8px 0; color: #4338CA; font-size: 14px; font-weight: bold;">🔍 Find Contact in Apollo</p>
            <p style="margin: 0; color: #666; font-size: 14px;">
              Search for: <strong>${domain}</strong>
            </p>
          </div>
          
          <!-- Action Buttons -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://app.apollo.io/#/companies?organizationDomains[]=${encodeURIComponent(domain)}" 
               target="_blank"
               style="display: inline-block; padding: 12px 24px; background-color: #6366F1; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 12px;">
              Find in Apollo
            </a>
            <a href="${lead.url}" 
               target="_blank"
               style="display: inline-block; padding: 12px 24px; background-color: #ECB615; color: #0A1B36; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Visit Site
            </a>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background-color: #0A1B36; padding: 16px; text-align: center;">
          <p style="margin: 0; color: #ffffff; font-size: 12px;">
            Speed test from scopesite.co.uk/web-design
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: ADMIN_EMAIL, name: 'Dan Cartwright' }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`[Email] Speed test lead notification sent for ${lead.url}`);
    return true;
  } catch (error) {
    console.error('Failed to send speed test lead notification:', error);
    return false;
  }
}
