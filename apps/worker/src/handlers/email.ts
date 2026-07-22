import { db, notificationDeliveries, notifications } from '@starsuperscare/database';
import { emailProvider, templates } from '@starsuperscare/email';
import { storage } from '@starsuperscare/storage';

export async function handleEmailSend(payload: any, eventId: string) {
  const { to, template, data } = payload;

  console.log(`[Email] Preparing ${template} email for ${to}`);

  let subject = '';
  let html = '';
  let text = '';

  let attachments: any[] = [];

  if (template === 'invoice') {
    if (data.invoiceObjectKey) {
      try {
        const pdfBytes = await storage.getObject(data.invoiceObjectKey);
        if (pdfBytes) {
          attachments = [{
            filename: `Invoice-${data.orderNumber}.pdf`,
            content: pdfBytes,
            contentType: 'application/pdf',
          }];
        }
      } catch (e) {
        console.error('[Email] Failed to attach invoice PDF:', e);
      }
    }
    const rendered = templates.invoice({
      orderNumber: data.orderNumber,
      customerName: data.customerName,
    });
    subject = rendered.subject;
    html = rendered.html;
    text = rendered.text;
  } else if (template === 'verification') {
    const rendered = templates.verification(data.code);
    subject = rendered.subject;
    html = rendered.html;
    text = rendered.text;
  } else if (template === 'resetPassword') {
    const rendered = templates.resetPassword(data.url);
    subject = rendered.subject;
    html = rendered.html;
    text = rendered.text;
  } else if (template === 'account-activation') {
    const rendered = templates['account-activation'](data.activationUrl);
    subject = rendered.subject;
    html = rendered.html;
    text = rendered.text;
  } else if (template === 'order-delivered') {
    const rendered = templates.orderDelivered(data);
    subject = rendered.subject;
    html = rendered.html;
    text = rendered.text;
  } else {
    throw new Error(`Unknown email template: ${template}`);
  }

  // Send via provider
  const emailOptions: any = {
    to,
    subject,
    html,
    text,
  };

  if (attachments.length > 0) {
    emailOptions.attachments = attachments;
  }

  const providerMessageId = await emailProvider.send(emailOptions);

  // Create notification record if user exists
  if (data.userId) {
    const [notification] = await db.insert(notifications).values({
      userId: data.userId,
      type: 'email',
      title: subject,
      body: text || 'Email notification',
      dataJson: { template, eventId },
    }).returning({ id: notifications.id });

    // Record delivery
    await db.insert(notificationDeliveries).values({
      notificationId: notification.id,
      provider: 'email',
      providerMessageId,
      status: 'delivered',
      sentAt: new Date().toISOString(),
    });
  }

  console.log(`[Email] Sent email ${providerMessageId} to ${to}`);
}

export async function handleEmailVerificationRequested(payload: any, _eventId: string) {
  const { email, token, customerName } = payload;
  const authUrl = typeof Deno !== 'undefined'
    ? Deno.env.get('VITE_AUTH_URL')
    : process?.env?.['VITE_AUTH_URL'];
  if (!authUrl) throw new Error('VITE_AUTH_URL is missing in environment variables');

  const verificationUrl = `${authUrl}/verify-email?token=${encodeURIComponent(token)}`;

  const rendered = templates.email_verification_requested({
    verificationUrl,
    customerName,
  });

  const from = typeof Deno !== 'undefined'
    ? Deno.env.get('SMTP_FROM')
    : process?.env?.['SMTP_FROM'];
  if (!from) throw new Error('SMTP_FROM is missing in environment variables');

  await emailProvider.send({
    from,
    to: email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

export async function handlePasswordResetRequested(payload: any, _eventId: string) {
  const { email, token } = payload;
  const authUrl = typeof Deno !== 'undefined'
    ? Deno.env.get('VITE_AUTH_URL')
    : process?.env?.['VITE_AUTH_URL'];
  if (!authUrl) throw new Error('VITE_AUTH_URL is missing in environment variables');

  const resetUrl = `${authUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const rendered = templates.resetPassword(resetUrl);

  const from = typeof Deno !== 'undefined'
    ? Deno.env.get('SMTP_FROM')
    : process?.env?.['SMTP_FROM'];
  if (!from) throw new Error('SMTP_FROM is missing in environment variables');

  await emailProvider.send({
    from,
    to: email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}
