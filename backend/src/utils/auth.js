const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');

const jwtSecret = process.env.JWT_SECRET || 'development-secret';

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}

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
        return crypto.timingSafeEqual(derivedBuffer, hashBuffer);
    } catch (error) {
        console.error('Failed to verify password', error);
        return false;
    }
}

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

function authenticateRequest(req) {
    const authHeader = req.get('authorization');
    if (!authHeader) {
        return null;
    }

    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
        return null;
    }

    return verifyAuthToken(match[1]);
}

function requireAdmin(req, res, next) {
    const payload = authenticateRequest(req);

    if (!payload) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (!payload.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = payload;
    return next();
}

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
