const fs = require('fs');

// Read the file
let content = fs.readFileSync('client/script.js', 'utf8');

// Replace the URL
content = content.replace(
    "const BACKEND_URL = 'https://your-backend-url.onrender.com';",
    "const BACKEND_URL = 'https://chatroom-hbfo.onrender.com';"
);

// Write back to file
fs.writeFileSync('client/script.js', content);

console.log('URL fixed successfully!'); 