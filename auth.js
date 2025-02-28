const fs = require('fs');
const url = require('url');
const cookie = require('cookie');

let jsonArray = [];

// Load existing data from a file on startup if it exists
const loadData = () => {
  if (fs.existsSync('users.json')) {
    const data = fs.readFileSync('users.json', 'utf8');
    jsonArray = JSON.parse(data);
  }
};

// Save the array to a file
const saveData = () => {
  fs.writeFileSync('users.json', JSON.stringify(jsonArray, null, 2));
};

loadData();

// Replace with fetch data from User, requered additionall access from Privy
function pickRandomAlias() {
  const words = [
    'Phoenix', 'Echo', 'Shadow', 'Blaze', 'Raven', 'Wolf', 'Storm', 'Hawk', 'Lynx', 'Falcon',
    'Zephyr', 'Titan', 'Viper', 'Crimson', 'Hunter', 'Serpent', 'Falcon', 'Nova', 'Inferno', 'Apex',
    'Nebula', 'Vortex', 'Thunder', 'Drake', 'Sable', 'Tempest', 'Cinder', 'Onyx', 'Nebula', 'Inferno',
    'Steel', 'Rogue', 'Skye', 'Gale', 'Ember', 'Jaguar', 'Slate', 'Wolf', 'Talon', 'Jet', 'Frost',
    'Cobalt', 'Shadow', 'Comet', 'Starlight', 'Lunar', 'Raven', 'Specter', 'Blade', 'Spartan', 'Titan',
    'Eclipse', 'Glacier', 'Reaper', 'Iron', 'Vega', 'Nimbus', 'Vigil', 'Blaze', 'Orbit', 'Draco',
    'Steel', 'Pyro', 'Spectral', 'Grit', 'Zenith', 'Cobra', 'Strider', 'Knight', 'Scythe', 'Inferno',
    'Zephyr', 'Griffin', 'Mystic', 'Bolt', 'Vanguard', 'Bane', 'Nova', 'Knight', 'Storm', 'Phantom',
    'Rogue', 'Eon', 'Eclipse', 'Savage', 'Vigilante', 'Tempest', 'Vortex', 'Grit', 'Nomad', 'Sable',
    'Shade', 'Rogue', 'Shade', 'Viper', 'Talon', 'Striker', 'Zenith', 'Bolt', 'Valor', 'Specter',
    'Frost', 'Pyro', 'Phantom', 'Cinder', 'Vigil', 'Hawk', 'Ash', 'Crimson', 'Vanguard'
  ];

  const randomWord = words[Math.floor(Math.random() * words.length)];
  return randomWord;
}

const authController = async (req, res) => {
    const { method, url: reqUrl } = req;
    const parsedUrl = url.parse(reqUrl, true);
    const { address } = parsedUrl.query; // Get query params
  
    try {
      if (!jsonArray.find(({ walletAddress }) => walletAddress == address)) {
        const alias = pickRandomAlias();
        const userData = {
          name: alias,
          walletAddress: address,
          twitter: '@' + alias,
        };

        jsonArray.push(userData);
        saveData(); // Save to the file
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, walletAddress: address }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Invalid JSON' }));
    }
}

module.exports = {
  authController
};
