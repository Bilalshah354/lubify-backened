const SourceIt = require('../models/SourceIt');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.submitSourceIt = async ({ email, phone, message }) => {
    if (!email || !phone || !message) {
        throw new Error('Email, phone, and message are required');
    }
    if (!EMAIL_REGEX.test(String(email).trim())) {
        throw new Error('Invalid email format');
    }

    const entry = new SourceIt({
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        message: String(message).trim()
    });
    await entry.save();
    return { message: 'Submission received', id: entry._id };
};
