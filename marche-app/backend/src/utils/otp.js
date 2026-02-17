const prisma = require('../lib/prisma');

const OTP_EXPIRY_MINUTES = 1;

async function generateOtp(phone) {
  // Invalider les anciens OTP pour ce numéro
  await prisma.otpCode.updateMany({
    where: { phone, used: false },
    data: { used: true },
  });

  // Stub : toujours le code par défaut (pour le dev, sera remplacé par envoi WhatsApp)
  const code = process.env.OTP_DEFAULT_CODE || '123456';

  const otp = await prisma.otpCode.create({
    data: {
      phone,
      code,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    },
  });

  // TODO: Envoyer le code via WhatsApp/SMS

  return otp;
}

async function verifyOtp(phone, code) {
  const otp = await prisma.otpCode.findFirst({
    where: {
      phone,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otp) return false;

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
}

module.exports = { generateOtp, verifyOtp };
