const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ เอา token จาก header: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // ❌ ไม่มี token
  if (!token || token === 'null') {
    return res.status(401).json({
      success: false,
      message: 'Not authorize to access this route'
    });
  }

  try {
    // 2️⃣ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ เอา user จาก DB
    req.user = await User.findById(decoded.id);
    if (!req.user) {
  return res.status(401).json({
    success: false,
    message: 'User no longer exists'
  });
}

    // 4️⃣ ผ่าน → ไปต่อ
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
