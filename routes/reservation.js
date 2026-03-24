  // routes/reservations.js
  const express = require('express');
  const {
    createReservation,
    getMyReservations,
    getAllReservations,
    getReservation,
    updateReservation,
    deleteReservation
  } = require('../controllers/reservation');

  const { protect, authorize } = require('../middleware/auth');

  const router = express.Router();
  router.get('/all', protect, authorize('admin'), getAllReservations);
  // user
  router.post('/', protect, authorize('user','admin'), createReservation);
  router.get('/', protect, authorize('user','admin'), getMyReservations);
  router.get('/:id', protect, authorize('user','admin'), getReservation);
  router.put('/:id', protect, authorize('user','admin'), updateReservation);
  router.delete('/:id', protect, authorize('user','admin'), deleteReservation);

  // admin


  module.exports = router;