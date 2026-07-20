import nodemailer from 'npm:nodemailer@6.9.13';

/** Options for sending an email */
export interface SendEmailOptions {
  /** Sender email address (optional) */
  from?: string;
  /** Recipient email address */
  to: string;
  /** Subject of the email */
  subject: string;
  /** HTML content of the email */
  html: string;
  /** Plain text fallback content */
  text?: string;
  /** Optional array of attachments */
  attachments?: Array<{
    /** Name of the attached file */
    filename: string;
    /** File data */
    content: Uint8Array;
    /** MIME type of the file */
    contentType: string;
  }>;
}

/** Email Provider Interface */
export interface EmailProvider {
  /**
   * Sends an email and returns the provider's message ID.
   */
  send(options: SendEmailOptions): Promise<string>;
}

/** Mock Email Provider Implementation */
export class MockEmailProvider implements EmailProvider {
  /**
   * Mock implementation of send email
   */
  async send(options: SendEmailOptions): Promise<string> {
    console.log(`[MockEmailProvider] Sending email to ${options.to}`);
    console.log(`[MockEmailProvider] Subject: ${options.subject}`);
    if (options.attachments && options.attachments.length > 0) {
      console.log(
        `[MockEmailProvider] Attachments: ${options.attachments.map((a) => a.filename).join(', ')}`,
      );
    }
    await Promise.resolve();
    // Return a mock message ID
    return `mock-msg-${crypto.randomUUID()}`;
  }
}

/** Default Email Provider instance */
export let emailProvider: EmailProvider;

if ((typeof Deno !== 'undefined' ? Deno.env.get('SMTP_HOST') : process?.env?.['SMTP_HOST'])) {
  class SmtpEmailProvider implements EmailProvider {
    private transporter: nodemailer.Transporter;
    private from: string;

    constructor() {
      this.transporter = nodemailer.createTransport({
        host: typeof Deno !== 'undefined' ? Deno.env.get('SMTP_HOST') : process?.env?.['SMTP_HOST'],
        port: parseInt(
          (typeof Deno !== 'undefined' ? Deno.env.get('SMTP_PORT') : process?.env?.['SMTP_PORT']) ||
            '587',
        ),
        secure: (typeof Deno !== 'undefined'
          ? Deno.env.get('SMTP_SECURE')
          : process?.env?.['SMTP_SECURE']) === 'true',
        auth: {
          user: typeof Deno !== 'undefined'
            ? Deno.env.get('SMTP_USER')
            : process?.env?.['SMTP_USER'],
          pass: typeof Deno !== 'undefined'
            ? Deno.env.get('SMTP_PASS')
            : process?.env?.['SMTP_PASS'],
        },
      });
      this.from = (typeof Deno !== 'undefined'
        ? Deno.env.get('SMTP_FROM')
        : process?.env?.['SMTP_FROM']) as string;
      if (!this.from) {
        throw new Error('SMTP_FROM environment variable is required');
      }
    }

    async send(options: SendEmailOptions): Promise<string> {
      try {
        const info = await this.transporter.sendMail({
          from: options.from || this.from,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          attachments: options.attachments,
        });
        return info.messageId || `smtp-msg-${crypto.randomUUID()}`;
      } catch (err) {
        console.error('[SmtpEmailProvider] Error sending email:', err);
        throw err;
      }
    }
  }
  emailProvider = new SmtpEmailProvider();
} else {
  // Fallback to mock provider
  console.log('[Email] No SMTP config found, using MockEmailProvider');
  emailProvider = new MockEmailProvider();
}

export * from './src/templates.ts';
