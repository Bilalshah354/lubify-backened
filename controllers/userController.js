
const userService = require('../services/userService');

exports.register = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await userService.loginUser(req.body);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

exports.refreshToken = (req, res) => {
    try {
        const result = userService.refreshToken(req.body.token);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const result = await userService.updateUser(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        // Extract email from request body
        const { email } = req.body;

        // Call the user service to handle the process
        const message = await userService.forgetPassword(email);

        // Respond with a success message
        res.status(200).json({ message });
    } catch (err) {
        // Handle errors by responding with an appropriate message
        res.status(400).json({ error: err.message });
    }
};




exports.resetPassword = async (req, res) => {
    try {
        // Extract reset token and new password from request body
        const { token, newPassword } = req.body;

        // Call the user service to handle the process
        const message = await userService.resetPassword(token, newPassword);

        // Respond with a success message
        res.status(200).json({ message });
    } catch (err) {
        // Handle errors by responding with an appropriate message
        res.status(400).json({ error: err.message });
    }
};

exports.shopifySignUp = async (req, res) => {
    console.log('[Shopify SignUp] Received call at /api/users/shopify-signup');
    console.log('[Shopify SignUp] Request body:', JSON.stringify(req.body));
    try {
        const shopifyData = req.body;
        // Map Shopify data to User fields
        const userPayload = {
            username: shopifyData.email,
            password: shopifyData.id ? shopifyData.id.toString() : Math.random().toString(36).slice(-8), // random fallback
            firstName: shopifyData.first_name || '',
            lastName: shopifyData.last_name || '',
            address: shopifyData.default_address ? `${shopifyData.default_address.address1 || ''} ${shopifyData.default_address.city || ''} ${shopifyData.default_address.country || ''}`.trim() : '',
            phone: shopifyData.phone || (shopifyData.default_address ? shopifyData.default_address.phone : ''),
            email: shopifyData.email,
            shopifyId: shopifyData.id ? shopifyData.id.toString() : undefined
        };
        const result = await userService.createShopifyUser(userPayload);
        console.log('[Shopify SignUp] Success response:', JSON.stringify(result));
        res.status(201).json(result);
    } catch (err) {
        console.error('[Shopify SignUp] Error:', err.message);
        res.status(400).json({ error: err.message });
        console.log('[Shopify SignUp] Error response:', JSON.stringify({ error: err.message }));
    }
};