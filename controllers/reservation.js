const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const Reservation = require("../models/reservation");

exports.createReservation = async (req, res, next) => {
  try {
    const { restaurant_id, date, table_count } = req.body;

    // 1️⃣ validate table_count ก่อน (สำคัญที่สุด)
    if (table_count > 3) {
      return res.status(400).json({
        success: false,
        message: 'You can reserve up to 3 tables only'
      });
    }

    // 2️⃣ validate date
    const reserveDate = new Date(date);
    if (isNaN(reserveDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // 3️⃣ ตรวจร้าน
    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // 4️⃣ ตรวจจองซ้ำ
    const existed = await Reservation.findOne({
      user_id: req.user.id,
      restaurant_id,
      date: reserveDate
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: 'You already have a reservation for this restaurant on this date'
      });
    }

    // 5️⃣ create
    const reservation = await Reservation.create({
      user_id: req.user.id,
      restaurant_id,
      date: reserveDate,
      table_count
    });

    res.status(201).json({
      success: true,
      data: reservation
    });

  } catch (err) {
    next(err);
  }
};
exports.getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      user_id: req.user.id
    }).populate('restaurant_id');

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (err) {
    next(err);
  }
};
// เพิ่มฟังก์ชันนี้ในไฟล์ Controller ของนาย
exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('restaurant_id');

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // เช็กว่าเป็นเจ้าของไหม (ยกเว้น admin)
    if (reservation.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    next(err);
  }
};
exports.getAllReservations = async (req, res, next) => {
  try {
    console.log("Starting getAllReservations..."); // Log ดูว่าฟังก์ชันทำงานไหม
    
    const reservations = await Reservation.find()
      .populate('user_id', 'name email')
      .populate('restaurant_id');

    console.log("Found:", reservations.length);

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (err) {
    console.error("DEBUG ERROR:", err.message); // 🚩 ดูใน Terminal Backend จะเห็นสาเหตุ
    res.status(500).json({
      success: false,
      message: err.message // 🚩 ส่ง Error ไปให้ Next.js โชว์เลยจะได้รู้ว่าพังเพราะอะไร
    });
  }
};
exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // user แก้ได้เฉพาะของตัวเอง
    if (
      reservation.user_id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // จำกัดโต๊ะ
    if (req.body.table_count > 3) {
      return res.status(400).json({
        success: false,
        message: 'You can reserve up to 3 tables only'
      });
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // user ลบได้เฉพาะของตัวเอง
    if (
      reservation.user_id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};