
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async ({ username, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    return 'User registered';
};

exports.loginUser = async ({ username, password }) => {
    const user = await User.findOne({ username }).populate('roles');
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    const token = generateToken(user._id);
    delete user.password;
    return { token , user };
};

exports.refreshToken = (token) => {
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        return { token: generateToken(id) };
    } catch {
        throw new Error('Invalid token');
    }
};

exports.createUser = async ({ username, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    return 'User created';
};

exports.updateUser = async (id, data) => {
    await User.findByIdAndUpdate(id, data);
    return 'User updated';
};

exports.deleteUser = async (id) => {
    await User.findByIdAndDelete(id);
    return 'User deleted';
};

// Utility to configure nodemailer to send emails
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com', // replace with your email
        pass: 'your-email-password'   // replace with your password or app password
    }
});

exports.forgetPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('No account found with that email');

    // Generate a token
    const token = crypto.randomBytes(32).toString('hex');

    // Set token and expiry on the user model
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send email with token (reset URL)
    const resetUrl = `http://yourapp.com/reset-password/${token}`;
    const mailOptions = {
        to: user.email,
        from: 'passwordreset@yourapp.com',
        subject: 'Password Change Request',
        text: `Please click on the following link to reset your password: ${resetUrl}`
    };

    transporter.sendMail(mailOptions);

    return 'Password reset email sent';
};

exports.resetPassword = async (token, newPassword) => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() } // Check token expiry
    });

    if (!user) throw new Error('Password reset token is invalid or has expired');

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return 'Password has been updated';
};