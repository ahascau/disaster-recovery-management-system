const jwt = require('jsonwebtoken');

const SECRET = 'your_secret_key';

function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ message: 'No token' });
    }

    const token = header.split(' ')[1];

    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = auth;