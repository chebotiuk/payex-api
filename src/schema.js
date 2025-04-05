const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    walletAddress: String!
    twitter: String!
    createdAt: String!
    updatedAt: String!
  }

  type Invoice {
    id: ID!
    to: String!
    network: String!
    requester: String!
    token: String!
    comment: String!
    amount: Float!
    status: String!
    txHash: String
    createdAt: String!
    updatedAt: String!
    user: User!
  }

  type Receipt {
    id: ID!
    invoiceId: String!
    type: String!
    status: String!
    txHash: String
    createdAt: String!
    updatedAt: String!
    invoice: Invoice!
  }

  type Query {
    users: [User!]!
    user(walletAddress: String!): User
    invoices: [Invoice!]!
    invoice(id: ID!): Invoice
    invoicesByTo(to: String!): [Invoice!]!
    invoicesByRequester(requester: String!): [Invoice!]!
    receipts: [Receipt!]!
    receipt(id: ID!): Receipt
  }

  type Mutation {
    createUser(name: String!, walletAddress: String!, twitter: String!): User!
    createInvoice(
      to: String!
      network: String!
      requester: String!
      token: String!
      comment: String!
      amount: Float!
    ): Invoice!
    createReceipt(invoiceId: String!, txHash: String): Receipt!
  }
`;

module.exports = typeDefs; 
