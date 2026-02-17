require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.$connect()
  .then(() => { console.log('Prisma connected OK!'); return p.$disconnect(); })
  .catch(e => { console.error('Connection error:', e.message); process.exit(1); });
