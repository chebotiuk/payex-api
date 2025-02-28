const fs = require('fs');

let jsonArray = [];

// Load existing data from a file on startup if it exists
const loadData = () => {
  if (fs.existsSync('users.json')) {
    const data = fs.readFileSync('users.json', 'utf8');
    jsonArray = JSON.parse(data);
  }
};

loadData();

const usersController = async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(jsonArray));
}

module.exports = {
  usersController
};
