const path = require('path');
const nodemailer = require('nodemailer');

const dotenv = require('dotenv');

function loadEnv() {
  // Ensure .env is loaded even if the process was started
  // from a different working directory (common in prod/dev tooling).
  // `override: true` lets updated .env values take effect without a restart.
  dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });
}

function getRequiredEnv(name, { stripSpaces = false } = {}) {
  let value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);

  value = String(value).trim();
  if (stripSpaces) value = value.replace(/\s+/g, '');
  return value;
}

function shouldMailDebug() {
  const v = process.env.MAIL_DEBUG;
  if (v == null) return false;
  return String(v).trim().toLowerCase() === 'true';
}

function createTransporter() {
  loadEnv();
  const debug = shouldMailDebug();
  // Option A: Generic SMTP
  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    const secure =
      typeof process.env.SMTP_SECURE === 'string'
        ? process.env.SMTP_SECURE.toLowerCase() === 'true'
        : port === 465;

    return nodemailer.createTransport({
      host: getRequiredEnv('SMTP_HOST'),
      port,
      secure,
      logger: debug,
      debug,
      auth: process.env.SMTP_USER
        ? {
            user: getRequiredEnv('SMTP_USER'),
            pass: getRequiredEnv('SMTP_PASS')
          }
        : undefined
    });
  }

  // Option B: Gmail (requires 2FA + App Password from Google Account, not the normal login password)
  if (process.env.GMAIL_USER) {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      logger: debug,
      debug,
      auth: {
        user: getRequiredEnv('GMAIL_USER'),
        // Users often paste the 16-char app password with spaces; Gmail expects it without spaces.
        pass: getRequiredEnv('GMAIL_PASS', { stripSpaces: true })
      }
    });
  }

  throw new Error(
    'Email not configured. Set SMTP_HOST (+ SMTP_PORT/SMTP_USER/SMTP_PASS) or GMAIL_USER/GMAIL_PASS.'
  );
}

let cachedTransporter;
function getTransporter() {
  if (!cachedTransporter) cachedTransporter = createTransporter();
  return cachedTransporter;
}

function normalizeHeaderValue(value) {
  if (value == null) return undefined;
  let v = String(value).trim();
  // Guard against accidental wrapping quotes in .env, e.g. MAIL_FROM="Name <a@b.com>"
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v || undefined;
}

function getDefaultFrom() {
  return normalizeHeaderValue(
    process.env.MAIL_FROM ||
      process.env.SMTP_FROM ||
      process.env.GMAIL_USER ||
      process.env.SMTP_USER
  );
}

function getDefaultReplyTo(defaultFrom) {
  return normalizeHeaderValue(process.env.MAIL_REPLY_TO || defaultFrom);
}

function parseAddressList(value) {
  const v = normalizeHeaderValue(value);
  if (!v) return undefined;
  const parts = v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : undefined;
}

function isTrueEnv(name) {
  const v = process.env[name];
  if (v == null) return false;
  return String(v).trim().toLowerCase() === 'true';
}

function getDefaultCopyBcc(from) {
  // MAIL_COPY_TO / MAIL_BCC_TO can be a comma-separated list:
  // "admin@x.com, audit@x.com"
  const explicit =
    parseAddressList(process.env.MAIL_COPY_TO) ||
    parseAddressList(process.env.MAIL_BCC_TO) ||
    parseAddressList(process.env.MAIL_BCC);
  if (explicit) return explicit;

  // If enabled, BCC a copy to the sender inbox.
  if (isTrueEnv('MAIL_COPY_SELF')) return from ? [from] : undefined;
  return undefined;
}

function getDefaultCopyCc(from) {
  const explicit =
    parseAddressList(process.env.MAIL_CC_TO) || parseAddressList(process.env.MAIL_CC);
  if (explicit) return explicit;
  if (isTrueEnv('MAIL_CC_SELF')) return from ? [from] : undefined;
  return undefined;
}

function getCopyStrategy() {
  const v = process.env.MAIL_COPY_STRATEGY;
  if (!v) return 'bcc';
  const normalized = String(v).trim().toLowerCase();
  if (normalized === 'separate') return 'separate';
  return 'bcc';
}

async function sendMail({ to, subject, text, html, replyTo, disableCopy = false }) {
  // Pick up any .env changes even if nodemon doesn't restart.
  loadEnv();
  const from = getDefaultFrom();
  const effectiveReplyTo = normalizeHeaderValue(replyTo) || getDefaultReplyTo(from);

  if (!from) {
    throw new Error(
      'Missing sender email. Set MAIL_FROM (recommended) or SMTP_FROM/GMAIL_USER/SMTP_USER.'
    );
  }

  try {
    const strategy = getCopyStrategy();
    const bcc = !disableCopy && strategy === 'bcc' ? getDefaultCopyBcc(from) : undefined;
    const cc = !disableCopy && strategy === 'bcc' ? getDefaultCopyCc(from) : undefined;

    const info = await getTransporter().sendMail({
      from,
      to,
      ...(cc ? { cc } : {}),
      ...(bcc ? { bcc } : {}),
      subject,
      text,
      html,
      replyTo: effectiveReplyTo
    });

    // Some providers (notably Gmail) may not surface self-BCC copies in Inbox.
    // This strategy sends a second, separate message to the copy inbox.
    if (!disableCopy && strategy === 'separate') {
      const copyTo =
        parseAddressList(process.env.MAIL_COPY_TO) ||
        parseAddressList(process.env.MAIL_BCC_TO) ||
        parseAddressList(process.env.MAIL_BCC) ||
        (isTrueEnv('MAIL_COPY_SELF') && from ? [from] : undefined);

      if (copyTo) {
        const header = `Copy of email sent to: ${to}\nSubject: ${subject}\n\n`;
        await sendMail({
          to: copyTo,
          subject: `[COPY] ${subject}`,
          text: text ? header + text : header,
          html: html,
          replyTo: effectiveReplyTo,
          disableCopy: true
        });
      }
    }

    return info;
  } catch (err) {
    // If credentials were changed (or revoked) while the process is running,
    // reset cached transporter so the next request recreates it.
    cachedTransporter = undefined;
    // eslint-disable-next-line no-console
    console.error('sendMail failed:', {
      message: err?.message,
      code: err?.code,
      command: err?.command,
      response: err?.response,
      responseCode: err?.responseCode
    });
    throw err;
  }
}

module.exports = { sendMail };