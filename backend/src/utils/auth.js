const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

// Secret key for signing and verifying JWT tokens. Should be a long random string in production.
const jwtSecret = process.env.JWT_SECRET || 'development-secret';

// Hash a password using scrypt with a random salt. We store the salt alongside the hash so we can verify passwords later.
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

// Check if a provided password matches the stored hash by re-hashing with the same salt and comparing securely.
function verifyPassword(password, storedHash) {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) {
        return false;
    }

    try {
        const derivedKey = crypto
            .scryptSync(password, salt, 64)
            .toString('hex');
        const derivedBuffer = Buffer.from(derivedKey, 'hex');
        const hashBuffer = Buffer.from(hash, 'hex');

        if (derivedBuffer.length !== hashBuffer.length) {
            return false;
        }
        // Use timingSafeEqual to prevent timing attacks where hackers measure how long comparisons take.
        return crypto.timingSafeEqual(derivedBuffer, hashBuffer);
    } catch (error) {
        console.error('Failed to verify password', error);
        return false;
    }
}

// Create a JWT token for a user that expires in 7 days. The token contains their ID, email, and admin status.
function generateToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            isAdmin: user.isAdmin
        },
        jwtSecret,
        { expiresIn: '7d' }
    );
}

// Verify a JWT token and return its payload if valid, or null if the token is invalid or expired.
function verifyAuthToken(token) {
    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, jwtSecret);
    } catch (error) {
        return null;
    }
}

// Extract the JWT token from the Authorization header and verify it. Returns the payload or null.
function authenticateRequest(req) {
    const authHeader = req.get('authorization');
    if (!authHeader) {
        return null;
    }

    // Tokens should be sent as "Bearer <token>" in the Authorization header.
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
        return null;
    }

    return verifyAuthToken(match[1]);
}

// Middleware that requires admin authentication. Blocks the request if the user isn't an admin.
function requireAdmin(req, res, next) {
    const payload = authenticateRequest(req);

    if (!payload) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (!payload.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    // Attach the user data to the request so route handlers can use it.
    req.user = payload;
    return next();
}

// Middleware that requires any authentication. Blocks the request if the user isn't logged in.
function requireAuth(req, res, next) {
    const payload = authenticateRequest(req);

    if (!payload || !payload.sub) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    req.user = payload;
    return next();
}

module.exports = {
    generateToken,
    hashPassword,
    verifyPassword,
    authenticateRequest,
    requireAdmin,
    requireAuth,
    verifyAuthToken
};
