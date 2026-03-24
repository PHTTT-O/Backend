const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  table_count: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Reservation", reservationSchema);