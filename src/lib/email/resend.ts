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
  message?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  createdAt: string;
}

export async function sendEnquiryNotification(payload: EmailNotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'prathap@mkmproperties.com';
  const fromEmail = process.env.EMAIL_FROM || 'MKM Properties <notifications@mkmproperties.com>';
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/leads`;

  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY is not configured. Simulating email notification for enquiry:', payload.enquiryId);
    return { success: true, messageId: 'simulated_no_key' };
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .card { background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto; overflow: hidden; }
        .header { background: #0b4632; color: #ffffff; padding: 24px; text-align: left; }
        .header h1 { margin: 0 0 6px 0; font-size: 20px; font-weight: 700; color: #fef7e0; }
        .content { padding: 24px; }
        .field { margin-bottom: 14px; font-size: 14px; line-height: 1.5; }
        .field strong { color: #0b4632; width: 160px; display: inline-block; }
        .badge { display: inline-block; padding: 4px 10px; background: #dcfce7; color: #166534; border-radius: 9999px; font-weight: 600; font-size: 13px; }
        .cta-btn { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #c59b27; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; }
        .footer { padding: 16px 24px; background: #f1f5f9; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New Real Estate Lead – MKM Properties</h1>
          <p style="margin: 0; opacity: 0.9; font-size: 13px;">New Enquiry received from Trichy Website</p>
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
            <strong>Project:</strong> <span class="badge">${escapeHtml(payload.projectName || 'General Enquiry')}</span>
          </div>
          <div class="field">
            <strong>Purpose:</strong> ${escapeHtml(payload.purpose)}
          </div>
          ${payload.budget ? `<div class="field"><strong>Budget Range:</strong> ${escapeHtml(payload.budget)}</div>` : ''}
          ${payload.preferredLocation ? `<div class="field"><strong>Preferred Area:</strong> ${escapeHtml(payload.preferredLocation)}</div>` : ''}
          ${payload.preferredVisitDate ? `<div class="field"><strong>Site Visit Date:</strong> ${escapeHtml(payload.preferredVisitDate)}</div>` : ''}
          ${payload.message ? `<div class="field"><strong>Customer Note:</strong> ${escapeHtml(payload.message)}</div>` : ''}
          
          <div style="margin-top: 18px; padding-top: 14px; border-top: 1px dashed #e2e8f0; font-size: 12px; color: #64748b;">
            <strong>Campaign Attribution:</strong><br>
            Source: ${payload.utmSource || 'Organic / Direct'} | Medium: ${payload.utmMedium || '-'} | Campaign: ${payload.utmCampaign || '-'}
          </div>

          <div style="text-align: center;">
            <a href="${dashboardUrl}" class="cta-btn">View Lead in Admin Dashboard</a>
          </div>
        </div>
        <div class="footer">
          MKM Properties – Trichy | Contact: PRATHAP (9629048171)
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [adminEmail],
        subject: `[New Lead] ${payload.name} – ${payload.projectName || 'MKM Trichy Plot Enquiry'}`,
        html: emailHtml
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[Email] Resend API error response:', res.status, errBody);
      return { success: false, error: `Resend HTTP ${res.status}` };
    }

    const data = await res.json();
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
