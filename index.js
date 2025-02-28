const http = require('http');
const url = require('url');
const fs = require('fs');

const port = 8000;
let jsonArray = [];

// Load existing data from a file on startup if it exists
const loadData = () => {
  if (fs.existsSync('invoices.json')) {
    const data = fs.readFileSync('invoices.json', 'utf8');
    jsonArray = JSON.parse(data);
  }
};

// Save the array to a file
const saveData = () => {
  fs.writeFileSync('invoices.json', JSON.stringify(jsonArray, null, 2));
};

loadData();

// Create the server
const server = http.createServer((req, res) => {
  const { method, url: reqUrl } = req;
  const parsedUrl = url.parse(reqUrl, true);
  const { id, to } = parsedUrl.query; // Get query params

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
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
      const invoices = jsonArray.filter(item => item.to.toLowerCase() === to.toLowerCase());
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(invoices));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Query parameter "id" or "to" is required' }));
    }

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Route not found' }));
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
