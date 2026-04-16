const SourceIt = require('../models/SourceIt');
const { sendMail } = require('../utils/mailer');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.submitSourceIt = async ({ email, phone, message }) => {
    if (!email || !phone || !message) {
        throw new Error('Email, phone, and message are required');
    }
    if (!EMAIL_REGEX.test(String(email).trim())) {
        throw new Error('Invalid email format');
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = String(phone).trim();
    const normalizedMessage = String(message).trim();

    const entry = new SourceIt({
        email: normalizedEmail,
        phone: normalizedPhone,
        message: normalizedMessage
    });
    try {
        await entry.save();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('SourceIt save failed:', err?.message || err);
        throw err;
    }

    let emailSent = false;
    let emailError;
    try {
        await sendMail({
            to: normalizedEmail,
            subject: 'We received your query',
            text:
                `Thanks for reaching out. We’ve received your query and will get back to you soon.\n\n` +
                `Your details:\n` +
                `Email: ${normalizedEmail}\n` +
                `Phone: ${normalizedPhone}\n` +
                `Message: ${normalizedMessage}`
        });
        emailSent = true;
    } catch (err) {
        emailError = {
            message: err?.message,
            code: err?.code,
            responseCode: err?.responseCode
        };
        // eslint-disable-next-line no-console
        console.error('Auto-reply email failed (source-it):', {
            message: err?.message,
            code: err?.code,
            command: err?.command,
            response: err?.response,
            responseCode: err?.responseCode
        });
    }
    return {
        message: 'Submission received',
        id: entry._id,
        emailSent,
        ...(emailSent ? {} : { emailError })
    };
};
