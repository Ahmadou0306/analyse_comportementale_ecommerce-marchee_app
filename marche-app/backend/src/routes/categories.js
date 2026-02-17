const express = require('express');
const prisma = require('../lib/prisma');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/categories - Liste toutes les catégories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (err) {
    console.error('get categories error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/categories - Créer une catégorie (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Nom et slug requis' });
    }

    const category = await prisma.category.create({
      data: { name, slug },
    });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Ce slug existe déjà' });
    }
    console.error('create category error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/categories/:id - Modifier une catégorie (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: { name, slug },
    });
    res.json(category);
  } catch (err) {
    console.error('update category error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/categories/:id - Supprimer une catégorie (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const catId = parseInt(req.params.id);

    // Vérifier qu'il n'y a pas de produits rattachés
    const productCount = await prisma.product.count({ where: { categoryId: catId } });
    if (productCount > 0) {
      return res.status(400).json({
        error: `Impossible de supprimer : ${productCount} produit(s) rattaché(s) à cette catégorie`,
      });
    }

    await prisma.category.delete({ where: { id: catId } });
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    console.error('delete category error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
