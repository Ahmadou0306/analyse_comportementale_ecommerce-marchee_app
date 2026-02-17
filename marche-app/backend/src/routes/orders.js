const express = require('express');
const crypto = require('crypto');
const prisma = require('../lib/prisma');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Créer une commande (authentifié)
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, total, shippingCost, address, city, commune, notes, paymentMethod } = req.body;

    if (!items || !items.length || !total || !address || !city || !paymentMethod) {
      return res.status(400).json({ error: 'Données de commande incomplètes' });
    }

    const orderNumber = Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString('hex').toUpperCase();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.userId,
        total,
        shippingCost: shippingCost || 0,
        address,
        city,
        commune,
        notes,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        user: { select: { phone: true, firstName: true, lastName: true } },
      },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('create order error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/orders/my - Mes commandes (authentifié)
router.get('/my', authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error('get my orders error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/orders - Toutes les commandes (admin only)
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: { phone: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error('get all orders error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/orders/:id/status - Changer statut (admin only)
router.patch('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: {
        items: { include: { product: true } },
        user: { select: { phone: true, firstName: true, lastName: true } },
      },
    });

    res.json(order);
  } catch (err) {
    console.error('update order status error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
