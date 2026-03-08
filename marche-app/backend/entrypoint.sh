#!/bin/sh
set -e

echo "==> Migration de la base de données..."
npm run db:migrate

echo "==> Seed de la base de données..."
npm run db:seed

echo "==> Démarrage du backend..."
exec node src/server.js
