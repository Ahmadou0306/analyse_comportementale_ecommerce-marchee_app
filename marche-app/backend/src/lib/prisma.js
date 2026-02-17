const { PrismaClient } = require('@prisma/client');

// Instance unique de PrismaClient partagée par toute l'application
const prisma = new PrismaClient();

module.exports = prisma;
