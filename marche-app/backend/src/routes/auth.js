const express = require('express');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { generateOtp, verifyOtp } = require('../utils/otp');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Numéro de téléphone requis' });
    }

    await generateOtp(phone);
    res.json({ message: 'Code OTP envoyé', phone });
  } catch (err) {
    console.error('send-otp error:', err);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du code' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: 'Numéro et code requis' });
    }

    const valid = await verifyOtp(phone, code);
    if (!valid) {
      return res.status(401).json({ error: 'Code invalide ou expiré' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });
    let isNewUser = false;

    if (!user) {
      user = await prisma.user.create({ data: { phone } });
      isNewUser = true;
    } else {
      // User exists but has no profile completed yet
      isNewUser = !user.firstName || !user.lastName;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
      },
      role: user.role,
      isNewUser,
    });
  } catch (err) {
    console.error('verify-otp error:', err);
    res.status(500).json({ error: 'Erreur lors de la vérification' });
  }
});

// PUT /api/auth/complete-profile
router.put('/complete-profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, email } = req.body;

    if (!firstName || !lastName || !dateOfBirth) {
      return res.status(400).json({ error: 'Nom, prénom et date de naissance requis' });
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        ...(email && { email }),
      },
    });

    res.json({
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('complete-profile error:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

module.exports = router;
