const { gql } = require('apollo-server-express');
const fs = require('fs');
const path = require('path');

const typeDefs = gql(
  fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8')
);

module.exports = typeDefs;
