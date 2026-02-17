const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prisma = require('../lib/prisma');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

const IMAGES_DIR = path.join(__dirname, '..', '..', 'images');

// Config multer — stockage dans backend/images/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(IMAGES_DIR, 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

// Supprime un fichier image uploadé (uniquement /images/uploads/*)
function deleteLocalImage(imagePath) {
  if (!imagePath || !imagePath.startsWith('/images/uploads/')) return;
  const fullPath = path.join(IMAGES_DIR, 'uploads', path.basename(imagePath));
  fs.unlink(fullPath, () => {});
}

// GET /api/products - Liste tous les produits (public)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (err) {
    console.error('get products error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/products/:id - Détail d'un produit (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json(product);
  } catch (err) {
    console.error('get product error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/products - Créer un produit (admin only)
// Accepte multipart (imageFile) ou JSON (image URL)
router.post('/', authenticate, isAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, description, price, oldPrice, image, tag, rating, categoryId } = req.body;

    let imageUrl = image || '';
    if (req.file) {
      imageUrl = `/images/uploads/${req.file.filename}`;
    }

    if (!name || !price || !imageUrl || !categoryId) {
      return res.status(400).json({ error: 'Champs requis manquants (name, price, image, categoryId)' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        image: imageUrl,
        tag: tag || null,
        rating: rating ? Number(rating) : 0,
        categoryId: Number(categoryId),
      },
      include: { category: true },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error('create product error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/products/:id - Modifier un produit (admin only)
router.put('/:id', authenticate, isAdmin, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, description, price, oldPrice, image, tag, rating, categoryId } = req.body;
    const productId = parseInt(req.params.id);

    // Récupérer l'ancien produit pour gérer le changement d'image
    const oldProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!oldProduct) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    let imageUrl = image || oldProduct.image;
    if (req.file) {
      imageUrl = `/images/uploads/${req.file.filename}`;
      // Supprimer l'ancienne image si elle était uploadée
      deleteLocalImage(oldProduct.image);
    } else if (image && image !== oldProduct.image) {
      // URL changée, supprimer l'ancienne si uploadée
      deleteLocalImage(oldProduct.image);
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name || oldProduct.name,
        description: description !== undefined ? description : oldProduct.description,
        price: price ? Number(price) : oldProduct.price,
        oldPrice: oldPrice ? Number(oldPrice) : null,
        image: imageUrl,
        tag: tag || null,
        rating: rating !== undefined && rating !== '' ? Number(rating) : oldProduct.rating,
        categoryId: categoryId ? Number(categoryId) : oldProduct.categoryId,
      },
      include: { category: true },
    });
    res.json(product);
  } catch (err) {
    console.error('update product error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/products/:id - Supprimer un produit (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Supprimer l'image uploadée du disque
    deleteLocalImage(product.image);

    await prisma.product.delete({ where: { id: product.id } });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    console.error('delete product error:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
