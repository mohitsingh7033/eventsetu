const express = require('express');
const router = express.Router();

const {
  getStats,
  getEventBookings,
  getPendingBookings,
  confirmBooking,
} = require('../controllers/adminController');

const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, getStats);

router.get(
  '/events/:id/bookings',
  protect,
  admin,
  getEventBookings
);

router.get(
  '/bookings/pending',
  protect,
  admin,
  getPendingBookings
);

router.put(
  '/bookings/:id/confirm',
  protect,
  admin,
  confirmBooking
);

module.exports = router;