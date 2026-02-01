/**
 * Portal Email Notifications
 * 
 * Email notification functions for the client portal.
 * Uses the existing Brevo integration from email.ts.
 */

import * as brevo from '@getbrevo/brevo';

// Initialize Brevo API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
);

// Brand constants
const FROM_EMAIL = 'noreply@scopesite.co.uk';
const FROM_NAME = 'ScopeSite Portal';
const ADMIN_EMAIL = 'dan@scopesite.co.uk';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scopesite.co.uk';

// Brand colors for email templates
const COLORS = {
  navy: '#0A1B36',
  gold: '#ECB615',
  graphite: '#1E2D50',
  white: '#FFFFFF',
};

/**
 * Generate base email HTML template
 */
function emailTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: ${COLORS.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${COLORS.navy}; padding: 24px 32px;">
              <table width="100%">
                <tr>
                  <td>
                    <span style="color: ${COLORS.white}; font-size: 20px; font-weight: bold; letter-spacing: 1px;">SCOPESITE</span>
                    <span style="color: ${COLORS.white}; opacity: 0.7; margin-left: 8px;">| Portal</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 24px 32px; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.5;">
                This email was sent from the ScopeSite Client Portal.<br>
                <a href="${BASE_URL}/portal/dashboard" style="color: ${COLORS.gold};">Go to Portal</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Send notification to admin when client submits a new request
 */
export async function sendRequestSubmittedNotification(data: {
  clientName: string;
  companyName: string;
  requestTitle: string;
  requestType: string;
  requestId: string;
  description: string;
}): Promise<boolean> {
  const content = `
    <h1 style="color: ${COLORS.navy}; font-size: 24px; margin: 0 0 16px 0;">🆕 New Request Submitted</h1>
    
    <div style="background-color: ${COLORS.navy}; color: ${COLORS.white}; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 18px; font-weight: bold;">${data.companyName}</p>
      <p style="margin: 4px 0 0 0; opacity: 0.8;">${data.clientName}</p>
    </div>
    
    <p style="color: ${COLORS.navy}; font-size: 16px; margin: 0 0 8px 0;"><strong>Request:</strong> ${data.requestTitle}</p>
    <p style="color: ${COLORS.graphite}; font-size: 14px; margin: 0 0 16px 0;"><strong>Type:</strong> ${data.requestType}</p>
    
    <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <p style="color: ${COLORS.navy}; margin: 0; white-space: pre-wrap; font-size: 14px;">${data.description.substring(0, 500)}${data.description.length > 500 ? '...' : ''}</p>
    </div>
    
    <a href="${BASE_URL}/portal/admin/requests" style="display: inline-block; background-color: ${COLORS.gold}; color: ${COLORS.navy}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View in Portal</a>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🆕 New Request from ${data.companyName}: ${data.requestTitle}`,
    html: emailTemplate(content, 'New Request Submitted'),
  });
}

/**
 * Send notification to client when estimate is ready
 */
export async function sendEstimateReadyNotification(data: {
  clientEmail: string;
  clientName: string;
  requestTitle: string;
  requestId: string;
  costDisplay: string;
}): Promise<boolean> {
  const content = `
    <h1 style="color: ${COLORS.navy}; font-size: 24px; margin: 0 0 16px 0;">Quote Ready for Approval</h1>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Hi ${data.clientName.split(' ')[0]},
    </p>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      We've prepared a quote for your request: <strong>"${data.requestTitle}"</strong>
    </p>
    
    <div style="background-color: ${COLORS.gold}; background: linear-gradient(135deg, ${COLORS.gold} 0%, #d4a012 100%); padding: 20px; border-radius: 8px; margin-bottom: 24px;">
      <p style="color: ${COLORS.navy}; margin: 0; font-size: 18px; font-weight: bold;">${data.costDisplay}</p>
    </div>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Please log in to your portal to review the details and approve the quote so we can get started.
    </p>
    
    <a href="${BASE_URL}/portal/requests/${data.requestId}" style="display: inline-block; background-color: ${COLORS.gold}; color: ${COLORS.navy}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Review &amp; Approve</a>
    
    <p style="color: ${COLORS.graphite}; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
      If you have any questions about this quote, you can reply directly in the portal.
    </p>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 24px 0 0 0;">
      Cheers,<br>
      Dan
    </p>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Quote Ready: ${data.requestTitle}`,
    html: emailTemplate(content, 'Quote Ready for Approval'),
  });
}

/**
 * Send notification to admin when client approves estimate
 */
export async function sendEstimateApprovedNotification(data: {
  clientName: string;
  companyName: string;
  requestTitle: string;
  requestId: string;
  costDisplay: string;
  trelloCardId?: string;
}): Promise<boolean> {
  const trelloLink = data.trelloCardId 
    ? `<p style="margin-top: 16px;"><a href="https://trello.com/c/${data.trelloCardId}" style="color: ${COLORS.gold};">View in Trello</a></p>`
    : '';

  const content = `
    <h1 style="color: ${COLORS.navy}; font-size: 24px; margin: 0 0 16px 0;">✅ Estimate Approved!</h1>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      ${data.clientName} from <strong>${data.companyName}</strong> has approved the estimate for:
    </p>
    
    <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <p style="color: ${COLORS.navy}; margin: 0; font-size: 18px; font-weight: bold;">"${data.requestTitle}"</p>
      <p style="color: ${COLORS.graphite}; margin: 8px 0 0 0;">${data.costDisplay}</p>
    </div>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Time to crack on! 🚀
    </p>
    
    <a href="${BASE_URL}/portal/admin/requests" style="display: inline-block; background-color: ${COLORS.gold}; color: ${COLORS.navy}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View in Portal</a>
    
    ${trelloLink}
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `✅ Estimate Approved: ${data.requestTitle} (${data.companyName})`,
    html: emailTemplate(content, 'Estimate Approved'),
  });
}

/**
 * Send notification when a new comment is added
 */
export async function sendNewCommentNotification(data: {
  recipientEmail: string;
  recipientName: string;
  authorName: string;
  requestTitle: string;
  requestId: string;
  comment: string;
  isToAdmin: boolean;
}): Promise<boolean> {
  const greeting = data.isToAdmin ? 'Hey Dan,' : `Hi ${data.recipientName.split(' ')[0]},`;
  
  const content = `
    <h1 style="color: ${COLORS.navy}; font-size: 24px; margin: 0 0 16px 0;">💬 New Comment</h1>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      ${greeting}
    </p>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
      <strong>${data.authorName}</strong> added a comment to "${data.requestTitle}":
    </p>
    
    <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid ${COLORS.gold};">
      <p style="color: ${COLORS.navy}; margin: 0; white-space: pre-wrap; font-size: 14px;">"${data.comment}"</p>
    </div>
    
    <a href="${BASE_URL}/portal/requests/${data.requestId}" style="display: inline-block; background-color: ${COLORS.gold}; color: ${COLORS.navy}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View &amp; Reply</a>
  `;

  return sendEmail({
    to: data.recipientEmail,
    subject: `New message on: ${data.requestTitle}`,
    html: emailTemplate(content, 'New Comment'),
  });
}

/**
 * Send notification when status changes
 */
export async function sendStatusChangedNotification(data: {
  clientEmail: string;
  clientName: string;
  requestTitle: string;
  requestId: string;
  newStatus: string;
}): Promise<boolean> {
  const content = `
    <h1 style="color: ${COLORS.navy}; font-size: 24px; margin: 0 0 16px 0;">📋 Status Update</h1>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Hi ${data.clientName.split(' ')[0]},
    </p>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Your request <strong>"${data.requestTitle}"</strong> has been updated.
    </p>
    
    <div style="background-color: ${COLORS.navy}; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <p style="color: ${COLORS.white}; margin: 0; font-size: 14px; opacity: 0.8;">New Status</p>
      <p style="color: ${COLORS.gold}; margin: 4px 0 0 0; font-size: 18px; font-weight: bold;">${data.newStatus}</p>
    </div>
    
    <a href="${BASE_URL}/portal/requests/${data.requestId}" style="display: inline-block; background-color: ${COLORS.gold}; color: ${COLORS.navy}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Details</a>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Status Update: ${data.requestTitle}`,
    html: emailTemplate(content, 'Status Update'),
  });
}

/**
 * Send notification when invoice is ready
 */
export async function sendInvoiceReadyNotification(data: {
  clientEmail: string;
  clientName: string;
  requestTitle: string;
  requestId: string;
  invoiceNumber: string;
  totalAmount: number;
  invoiceUrl?: string;
}): Promise<boolean> {
  const invoiceLink = data.invoiceUrl 
    ? `<p style="margin-top: 16px;"><a href="${data.invoiceUrl}" style="color: ${COLORS.gold};">Download Invoice PDF</a></p>`
    : '';

  const content = `
    <h1 style="color: ${COLORS.navy}; font-size: 24px; margin: 0 0 16px 0;">🧾 Invoice Ready</h1>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Hi ${data.clientName.split(' ')[0]},
    </p>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Great news! The work on <strong>"${data.requestTitle}"</strong> is complete and your invoice is ready.
    </p>
    
    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
      <table width="100%">
        <tr>
          <td>
            <p style="color: ${COLORS.graphite}; margin: 0; font-size: 14px;">Invoice Number</p>
            <p style="color: ${COLORS.navy}; margin: 4px 0 0 0; font-size: 16px; font-weight: bold;">${data.invoiceNumber}</p>
          </td>
          <td align="right">
            <p style="color: ${COLORS.graphite}; margin: 0; font-size: 14px;">Amount Due</p>
            <p style="color: ${COLORS.navy}; margin: 4px 0 0 0; font-size: 24px; font-weight: bold;">£${data.totalAmount.toLocaleString()}</p>
          </td>
        </tr>
      </table>
    </div>
    
    <a href="${BASE_URL}/portal/requests/${data.requestId}" style="display: inline-block; background-color: ${COLORS.gold}; color: ${COLORS.navy}; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View in Portal</a>
    
    ${invoiceLink}
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 24px 0 0 0;">
      Thank you for working with us!<br>
      Dan
    </p>
  `;

  return sendEmail({
    to: data.clientEmail,
    subject: `Invoice Ready: ${data.requestTitle}`,
    html: emailTemplate(content, 'Invoice Ready'),
  });
}

/**
 * Send client invitation email
 */
export async function sendClientInvitation(data: {
  email: string;
  clientName: string;
  companyName: string;
}): Promise<boolean> {
  const content = `
    <h1 style="color: ${COLORS.navy}; font-size: 24px; margin: 0 0 16px 0;">Welcome to ScopeSite Portal</h1>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Hi ${data.clientName.split(' ')[0]},
    </p>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      You've been invited to the ScopeSite Client Portal! This is where you can:
    </p>
    
    <ul style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.8; margin: 0 0 24px 0; padding-left: 20px;">
      <li>Submit change requests and new project ideas</li>
      <li>Track the progress of your work</li>
      <li>Approve quotes before work begins</li>
      <li>Communicate directly with the team</li>
      <li>Access project files and deliverables</li>
    </ul>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
      Click the button below to set up your account:
    </p>
    
    <a href="${BASE_URL}/portal/sign-up" style="display: inline-block; background-color: ${COLORS.gold}; color: ${COLORS.navy}; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">Create Your Account</a>
    
    <p style="color: ${COLORS.graphite}; font-size: 14px; line-height: 1.6; margin: 24px 0 0 0;">
      Use this email address (${data.email}) when signing up.
    </p>
    
    <p style="color: ${COLORS.graphite}; font-size: 16px; line-height: 1.6; margin: 24px 0 0 0;">
      Looking forward to working with you!<br>
      Dan<br>
      ScopeSite Digital Studios
    </p>
  `;

  return sendEmail({
    to: data.email,
    subject: `You're invited to the ScopeSite Portal`,
    html: emailTemplate(content, 'Portal Invitation'),
  });
}

/**
 * Base email sending function
 */
async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured, skipping email');
    return false;
  }

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = params.subject;
    sendSmtpEmail.htmlContent = params.html;
    sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
    sendSmtpEmail.to = [{ email: params.to }];
    
    if (params.replyTo) {
      sendSmtpEmail.replyTo = { email: params.replyTo };
    }

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
