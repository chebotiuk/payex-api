const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (_, { walletAddress }) => {
      return await prisma.user.findUnique({
        where: { walletAddress },
      });
    },
    invoices: async () => {
      return await prisma.invoice.findMany({
        include: { user: true },
      });
    },
    invoice: async (_, { id }) => {
      return await prisma.invoice.findUnique({
        where: { id },
        include: { user: true },
      });
    },
    invoicesByTo: async (_, { to }) => {
      return await prisma.invoice.findMany({
        where: { to },
        include: { user: true },
      });
    },
    invoicesByRequester: async (_, { requester }) => {
      return await prisma.invoice.findMany({
        where: { requester },
        include: { user: true },
      });
    },
    receipts: async () => {
      return await prisma.receipt.findMany({
        include: { invoice: true },
      });
    },
    receipt: async (_, { id }) => {
      return await prisma.receipt.findUnique({
        where: { id },
        include: { invoice: true },
      });
    },
  },
  Mutation: {
    createUser: async (_, { name, walletAddress, twitter }) => {
      return await prisma.user.create({
        data: {
          name,
          walletAddress,
          twitter,
        },
      });
    },
    createInvoice: async (_, { to, network, requester, token, comment, amount }) => {
      // First, check if the user exists
      const user = await prisma.user.findUnique({
        where: { walletAddress: requester }
      });

      if (!user) {
        throw new Error(`User with wallet address ${requester} not found`);
      }

      return await prisma.invoice.create({
        data: {
          to,
          network,
          token,
          comment,
          amount,
          user: {
            connect: {
              walletAddress: requester
            }
          }
        },
        include: {
          user: true
        }
      });
    },
    createReceipt: async (_, { invoiceId, txHash }) => {
      // Update invoice status
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status: 'paid', txHash },
      });

      return await prisma.receipt.create({
        data: {
          invoiceId,
          txHash,
        },
        include: { invoice: true },
      });
    },
  },
};

module.exports = resolvers; 
