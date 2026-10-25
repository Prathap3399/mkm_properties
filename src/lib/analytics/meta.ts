import crypto from 'crypto';

export interface MetaCapiEventPayload {
  eventName: 'PageView' | 'ViewContent' | 'Lead' | 'Contact' | 'BrochureDownload' | 'Schedule' | 'SiteVisitRequest';
  eventId: string; // Used for browser + server deduplication
  eventSourceUrl: string;
  userData?: {
    email?: string | null;
    phone?: string | null;
    clientIpAddress?: string | null;
    clientUserAgent?: string | null;
  };
  customData?: {
    contentName?: string;
    contentCategory?: string;
    projectId?: string;
    value?: number;
    currency?: string;
    status?: string;
  };
}

// SHA-256 hash helper for normalising PII before sending to Meta
function hashData(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

export async function sendMetaCapiEvent(payload: MetaCapiEventPayload): Promise<boolean> {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    // Graceful skip if Meta credentials not configured
    return false;
  }

  const userDataFormatted: Record<string, any> = {};

  if (payload.userData?.email) {
    userDataFormatted.em = [hashData(payload.userData.email)];
  }
  if (payload.userData?.phone) {
    // Clean and hash phone (e.g. 919629048171)
    const cleanPhone = payload.userData.phone.replace(/\D/g, '');
    userDataFormatted.ph = [hashData(cleanPhone)];
  }
  if (payload.userData?.clientIpAddress) {
    userDataFormatted.client_ip_address = payload.userData.clientIpAddress;
  }
  if (payload.userData?.clientUserAgent) {
    userDataFormatted.client_user_agent = payload.userData.clientUserAgent;
  }

  const eventData = {
    event_name: payload.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: payload.eventId,
    event_source_url: payload.eventSourceUrl,
    action_source: 'website',
    user_data: userDataFormatted,
    custom_data: payload.customData
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [eventData]
      })
    });

    return res.ok;
  } catch (err) {
    console.error('[Meta CAPI] Error dispatching server event:', err);
    return false;
  }
}
