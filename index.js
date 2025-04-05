const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const typeDefs = require('./src/schema');
const resolvers = require('./src/resolvers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Enable CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // You can add authentication here
    return { req };
  },
  introspection: true,
  playground: true,
  debug: true,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

// Start the server
async function startServer() {
  try {
    await server.start();
    
    // Apply GraphQL middleware
    server.applyMiddleware({ 
      app,
      cors: false // Let express handle CORS
    });

    // Basic health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
