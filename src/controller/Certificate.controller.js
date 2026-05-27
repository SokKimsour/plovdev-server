const { Certificate, courses, Users } = require('../models');
const AppError = require('../utils/appError');

// GET /api/v1/certificates/me (Protected route)
const getMyCertificates = async (req, res) => {
  const userId = req.user.id;

  const certificates = await Certificate.findAll({
    where: { userId },
    include: [
      {
        model: courses,
        as: 'course',
        attributes: ['id', 'title_en', 'thumbnailUrl']
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    message: 'Certificates retrieved successfully.',
    data: certificates
  });
};

// GET /api/v1/certificates/verify/:verificationId (Public route)
const verifyCertificate = async (req, res) => {
  const { verificationId } = req.params;

  const certificate = await Certificate.findOne({
    where: { verification_id: verificationId },
    include: [
      {
        model: Users,
        as: 'user',
        attributes: ['id', 'fullName', 'userName']
      },
      {
        model: courses,
        as: 'course',
        attributes: ['id', 'title_en', 'description', 'total_duration_secs']
      }
    ]
  });

  if (!certificate) {
    throw new AppError('Invalid verification code. Certificate not found.', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Certificate verified successfully.',
    data: certificate
  });
};

module.exports = {
  getMyCertificates,
  verifyCertificate
};