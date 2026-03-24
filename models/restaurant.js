const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  open_time: {
    type: String, // "10:00"
    required: true
  },
  close_time: {
    type: String, // "22:00"
    required: true
  }
}, {
  timestamps: true
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
restaurantSchema.virtual('reservations', {
  ref: 'Reservation',
  localField: '_id',
  foreignField: 'restaurant_id',
  justOne: false
});

module.exports = mongoose.model("Restaurant", restaurantSchema);