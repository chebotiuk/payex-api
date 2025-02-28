const http = require('http');
const url = require('url');
const fs = require('fs');
const { authController } = require('./auth');
const { usersController } = require('./users');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
let jsonArray = [];

// Load existing data from a file on startup if it exists
const loadData = () => {
  if (fs.existsSync('data.json')) {
    const data = fs.readFileSync('data.json', 'utf8');
    jsonArray = JSON.parse(data);
  }
};

// Save the array to a file
const saveData = () => {
  fs.writeFileSync('data.json', JSON.stringify(jsonArray, null, 2));
};

loadData();

// Create the server
const server = http.createServer((req, res) => {
  const { method, url: reqUrl } = req;
  const parsedUrl = url.parse(reqUrl, true);
  const { id, to, requester } = parsedUrl.query; // Get query params

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', CLIENT_URL); // Specify the frontend URL (not '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies)

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === 'GET' && parsedUrl.pathname === '/auth') {
    return authController(req, res);
  }

  // Create invoice
  if (method === 'POST' && parsedUrl.pathname === '/invoice') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const jsonData = JSON.parse(body);
        const newId = jsonArray.length + 1; // Create a new ID
        jsonData.id = newId; // Add the id to the object
        jsonArray.push(jsonData); // Add to the array
        saveData(); // Save to the file
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, id: newId }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
      }
    });

    // Get invoice by ID
  } else if (method === 'GET' && parsedUrl.pathname === '/invoice') {
    if (id) {
      const item = jsonArray.find(item => item.id == id);
      if (item) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(item));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Item not found' }));
      }
    } else if (to) {
      let invoices = jsonArray.filter(item => (item.type !== 'receipt' && item.to?.toLowerCase() === to.toLowerCase()));
      invoices = invoices.map(({ id, ...etc }) => ({
        id,
        status: jsonArray.find(item => item.type == 'receipt' && item.invoiceId == id) ? "paid" : "unpaid",
        ...etc,
      }))
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(invoices));
    } else if (requester) {
      let invoices = jsonArray.filter(item => (item.type !== 'receipt' && item.requester?.toLowerCase() === requester.toLowerCase()));
      invoices = invoices.map(({ id, ...etc }) => ({
        id,
        status: jsonArray.find(item => item.type == 'receipt' && item.invoiceId == id) ? "paid" : "unpaid",
        ...etc,
      }))
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(invoices));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Query parameter "id" or "to" is required' }));
    }
  } else if (method === 'POST' && parsedUrl.pathname === '/receipt') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const jsonData = JSON.parse(body);
        jsonData.type = "receipt";
        jsonData.status = "paid";
        jsonArray.push(jsonData); // Add to the array
        saveData(); // Save to the file
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
      }
    });
  } else if (method === 'GET' && parsedUrl.pathname === '/users') {
    return usersController(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Route not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${port}`);
});
