const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Configure DOMPurify to work with Node.js
const window = new JSDOM('').window;
const dompurify = DOMPurify(window);

// Function to sanitize input recursively
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return dompurify.sanitize(input); // Sanitize string
    } else if (typeof input === 'object' && input !== null) {
        for (let key in input) {
            input[key] = sanitizeInput(input[key]);
        }
    }
    return input;
}

module.exports = sanitizeInput;