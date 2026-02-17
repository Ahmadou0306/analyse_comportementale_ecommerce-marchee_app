const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/dashboard - Stats (admin only)
router.get('/dashboard', authenticate, isAdmin, async (req, res) => {
  try {
    const [totalProducts, totalCategories, orders, recentOrders] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.findMany({
        select: { total: true, status: true, createdAt: true },
      }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: { select: { name: true, categoryId: true } } } },
          user: { select: { phone: true, firstName: true, lastName: true } },
        },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;

    // Revenue by category (toutes les commandes, pas seulement les récentes)
    const allOrderItems = await prisma.orderItem.findMany({
      include: { product: { select: { categoryId: true } } },
    });
    const categoryRevenue = {};
    for (const item of allOrderItems) {
      const catId = item.product.categoryId;
      categoryRevenue[catId] = (categoryRevenue[catId] || 0) + item.unitPrice * item.quantity;
    }

    const categories = await prisma.category.findMany();
    const revenueByCategory = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      revenue: categoryRevenue[cat.id] || 0,
    }));

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCategories,
      recentOrders,
      revenueByCategory,
    });
  } catch (err) {
    console.error('dashboard error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
