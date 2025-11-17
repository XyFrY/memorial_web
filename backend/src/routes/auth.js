const express = require('express');
const User = require('../models/user');
const {
    hashPassword,
    verifyPassword,
    generateToken
} = require('../utils/auth');

const authRouter = express.Router();

// POST /api/auth/signup - Create a new user account and return a token for immediate login.
authRouter.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: 'email and password are required' });
    }

    try {
        // Normalize the email to lowercase to prevent duplicate accounts with different casing.
        const normalizedEmail = email.trim().toLowerCase();

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res
                .status(409)
                .json({ error: 'A user with that email already exists' });
        }

        // Create user
        const user = await User.create({
            email: normalizedEmail,
            passwordHash: hashPassword(password),
            name: name?.trim()
        });

        const token = generateToken(user);

        // Return the user data (without the password hash) and a token they can use for subsequent requests.
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            },
            token
        });
    } catch (error) {
        console.error('Failed to sign up user:', error);
        return res.status(500).json({ error: 'Failed to sign up user' });
    }
});

// POST /api/auth/login - Verify credentials and return a token if the email and password are correct.
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: 'email and password are required' });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        // Return a generic error message whether the email or password is wrong to avoid revealing which accounts exist.
        if (!user || !verifyPassword(password, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user);

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            },
            token
        });
    } catch (error) {
        console.error('Failed to log in user:', error);
        return res.status(500).json({ error: 'Failed to log in user' });
    }
});

module.exports = {
    authRouter
};
