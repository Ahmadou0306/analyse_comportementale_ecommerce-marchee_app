const express = require('express');

const router = express.Router();

// POST /api/events/cart — reçoit un événement panier depuis le frontend
router.post('/cart', (req, res) => {
  const { event, userId, product, items, subtotal } = req.body;

  const log = {
    event,
    userId: userId || 'anonyme',
    ...(product && { product: { id: product.id, name: product.name, price: product.price } }),
    items: (items || []).map((i) => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      qty: i.qty,
    })),
    subtotal: subtotal || 0,
    timestamp: new Date().toISOString(),
  };

  console.log(`[CART] ${JSON.stringify(log)}`);

  res.sendStatus(204);
});

module.exports = router;
