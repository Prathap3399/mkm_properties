export interface EmailNotificationPayload {
  enquiryId: string;
  name: string;
  phone: string;
  email?: string | null;
  projectName?: string | null;
  purpose: string;
  budget?: string | null;
  preferredLocation?: string | null;
  purchaseTimeline?: string | null;
  preferredVisitDate?: string | null;
  preferredTime?: string | null;
  message?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  createdAt: string;
}

export async function sendEnquiryNotification(payload: EmailNotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = (process.env.RESEND_API_KEY || '').trim();
  const rawAdminEmails = (process.env.ADMIN_NOTIFICATION_EMAIL || 'prathap@mkmproperties.com')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  const adminEmails = rawAdminEmails.length > 0 ? rawAdminEmails : ['prathap@mkmproperties.com'];
  const configuredFrom = (process.env.EMAIL_FROM || '').trim();
  const defaultFrom = configuredFrom || 'MKM Properties <onboarding@resend.dev>';
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/leads`;

  if (!apiKey) {
    console.warn(`[EMAIL ALERT] New site visit enquiry #${payload.enquiryId} from ${payload.name} (${payload.phone}) stored in DB, but email could not be sent because RESEND_API_KEY is not configured.`);
    return { success: false, error: 'RESEND_API_KEY is not configured' };
  }

  // Admin Notification Email Template
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .header { background: #0b4632; color: #ffffff; padding: 24px; text-align: left; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #fef7e0; }
        .content { padding: 24px; }
        .field { margin-bottom: 14px; font-size: 14px; line-height: 1.5; }
        .field strong { color: #0b4632; width: 170px; display: inline-block; font-weight: 600; }
        .badge { display: inline-block; padding: 4px 10px; background: #dcfce7; color: #166534; border-radius: 9999px; font-weight: 600; font-size: 13px; }
        .cta-btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #c59b27; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .footer { padding: 16px 24px; background: #f1f5f9; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New Site Visit Enquiry – MKM Properties</h1>
          <p style="margin: 0; opacity: 0.9; font-size: 13px;">Customer submitted a site visit booking on the Trichy website</p>
        </div>
        <div class="content">
          <div class="field">
            <strong>Customer Name:</strong> ${escapeHtml(payload.name)}
          </div>
          <div class="field">
            <strong>Mobile Number:</strong> <a href="tel:${escapeHtml(payload.phone)}" style="color: #0b4632; font-weight: 700;">${escapeHtml(payload.phone)}</a>
          </div>
          ${payload.email ? `<div class="field"><strong>Email Address:</strong> <a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></div>` : ''}
          <div class="field">
            <strong>Preferred Plot Area:</strong> <span class="badge">${escapeHtml(payload.preferredLocation || payload.projectName || 'General Trichy Plots')}</span>
          </div>
          <div class="field">
            <strong>Purchase Purpose:</strong> ${escapeHtml(payload.purpose)}
          </div>
          ${payload.budget ? `<div class="field"><strong>Budget Range:</strong> ${escapeHtml(payload.budget)}</div>` : ''}
          ${payload.preferredVisitDate ? `<div class="field"><strong>Preferred Visit Date:</strong> ${escapeHtml(payload.preferredVisitDate)}</div>` : ''}
          ${payload.preferredTime ? `<div class="field"><strong>Preferred Time Slot:</strong> ${escapeHtml(payload.preferredTime)}</div>` : ''}
          ${payload.message ? `<div class="field"><strong>Customer Notes:</strong> ${escapeHtml(payload.message)}</div>` : ''}
          
          <div style="margin-top: 18px; padding-top: 14px; border-top: 1px dashed #e2e8f0; font-size: 12px; color: #64748b;">
            <strong>Campaign Attribution:</strong><br>
            Source: ${payload.utmSource || 'Direct Website Visit'} | Medium: ${payload.utmMedium || '-'} | Campaign: ${payload.utmCampaign || '-'}
          </div>

          <div style="text-align: center; margin-top: 10px;">
            <a href="${dashboardUrl}" class="cta-btn">View in Admin Dashboard</a>
          </div>
        </div>
        <div class="footer">
          MKM Properties – Trichy | Senior Advisor: PRATHAP (+91 96290 48171)
        </div>
      </div>
    </body>
    </html>
  `;

  async function postResendEmail(from: string, to: string[], subject: string, html: string) {
    return fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html
      })
    });
  }

  try {
    let fromToUse = defaultFrom;
    let res = await postResendEmail(
      fromToUse,
      adminEmails,
      `[New Site Visit] ${payload.name} – ${payload.preferredLocation || payload.projectName || 'Trichy Plots'}`,
      adminEmailHtml
    );

    // If custom domain fails with 403 or unverified domain, fallback to onboarding@resend.dev
    if (!res.ok && res.status === 403 && fromToUse !== 'MKM Properties <onboarding@resend.dev>') {
      console.warn('[Email] Custom domain unverified on Resend. Falling back to onboarding@resend.dev');
      fromToUse = 'MKM Properties <onboarding@resend.dev>';
      res = await postResendEmail(
        fromToUse,
        adminEmails,
        `[New Site Visit] ${payload.name} – ${payload.preferredLocation || payload.projectName || 'Trichy Plots'}`,
        adminEmailHtml
      );
    }

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[Email] Resend API error response:', res.status, errBody);
      return { success: false, error: `Resend HTTP ${res.status}: ${errBody}` };
    }

    const data = await res.json();
    console.info(`[Email] Admin notification delivered successfully (Message ID: ${data.id}) to ${adminEmails.join(', ')}`);

    // Customer confirmation email (if customer provided their email address)
    if (payload.email && payload.email.includes('@')) {
      const customerEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .card { background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 580px; margin: 0 auto; overflow: hidden; }
            .header { background: #0b4632; color: #ffffff; padding: 24px; text-align: left; }
            .header h1 { margin: 0 0 6px 0; font-size: 18px; color: #fef7e0; }
            .content { padding: 24px; }
            .field { margin-bottom: 12px; font-size: 14px; }
            .footer { padding: 16px; background: #f1f5f9; font-size: 12px; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>Site Visit Request Received – MKM Properties</h1>
              <p style="margin: 0; font-size: 13px; opacity: 0.9;">Tiruchirappalli, Tamil Nadu</p>
            </div>
            <div class="content">
              <p>Dear <strong>${escapeHtml(payload.name)}</strong>,</p>
              <p>Thank you for booking a complimentary site visit with MKM Properties. We have successfully registered your request with the following details:</p>
              
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 18px 0;">
                <div class="field"><strong>Selected Plot Area:</strong> ${escapeHtml(payload.preferredLocation || 'Trichy Plots')}</div>
                ${payload.preferredVisitDate ? `<div class="field"><strong>Requested Date:</strong> ${escapeHtml(payload.preferredVisitDate)}</div>` : ''}
                ${payload.preferredTime ? `<div class="field"><strong>Time Slot:</strong> ${escapeHtml(payload.preferredTime)}</div>` : ''}
                <div class="field"><strong>Contact Registered:</strong> ${escapeHtml(payload.phone)}</div>
              </div>

              <p>Our Senior Property Advisor, <strong>PRATHAP</strong>, will contact you shortly to confirm your visit arrangements and arrange your free cab pickup.</p>
              
              <p style="margin-top: 20px;">If you have immediate questions, feel free to contact us directly:</p>
              <p style="font-size: 15px;">
                📞 <strong>Direct Phone:</strong> <a href="tel:9629048171" style="color: #0b4632;">+91 96290 48171</a><br>
                💬 <strong>WhatsApp:</strong> <a href="https://wa.me/919629048171" style="color: #059669;">Instant Chat</a>
              </p>
            </div>
            <div class="footer">
              © 2026 MKM Properties · Cantonment, Trichy · Zero Brokerage
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        await postResendEmail(
          fromToUse,
          [payload.email],
          'Your Site Visit Request Confirmation – MKM Properties Trichy',
          customerEmailHtml
        );
        console.info(`[Email] Customer confirmation delivered to ${payload.email}`);
      } catch (custErr: any) {
        console.warn('[Email] Non-fatal customer confirmation failure:', custErr.message);
      }
    }

    return { success: true, messageId: data.id };
  } catch (err: any) {
    console.error('[Email] Unexpected failure calling Resend:', err.message);
    return { success: false, error: err.message };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
