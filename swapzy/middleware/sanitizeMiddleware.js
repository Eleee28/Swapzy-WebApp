const sanitizeInput = require('../utils/sanitizer');

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) req.body = sanitizeInput(req.body); // Sanitize request body
    if (req.query) req.query = sanitizeInput(req.query); // Sanitize query parameters
    if (req.params) req.params = sanitizeInput(req.params); // Sanitize URL parameters
    if (req.session) req.session = sanitizeInput(req.session); // Sanitize session data

    next();
}

module.exports = sanitizeMiddleware;