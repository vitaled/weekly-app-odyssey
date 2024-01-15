// Import necessary modules
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}
const express = require('express');
const ejs = require('ejs');

// Initialize the app
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the home page
app.get('/', (req, res) => {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const rgb = `rgb(${r}, ${g}, ${b})`;
        const hex = rgbToHex(r, g, b);
        colors.push({ rgb, hex });
    }
    res.render('index', { colors: colors });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});