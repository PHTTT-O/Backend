    // routes/restaurant.js
    const express = require('express');
    const { createRestaurant, 
            getRestaurants, 
            getRestaurantById, 
            updateRestaurant, 
            deleteRestaurant } = require('../controllers/restaurant');
    const { protect, authorize } = require('../middleware/auth');

    const router = express.Router();

    // user

    router.get('/', getRestaurants);
    router.get('/:id', getRestaurantById);

    // admin
    router.post('/', protect, authorize('admin'), createRestaurant);
    router.put('/:id', protect, authorize('admin'), updateRestaurant);
    router.delete('/:id', protect, authorize('admin'), deleteRestaurant);

    module.exports = router;