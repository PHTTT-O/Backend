const User = require('../models/user');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email,telephone, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      telephone,
      password,
      role
    });
    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.log(err.stack);
    res.status(400).json({
      success: false
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide an email and password'
      });
    }

    // 2. Check for user (ต้อง select password เพราะ schema ซ่อนไว้)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid credentials'
      });
    }

    // 3. Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: 'Invalid credentials'
      });
    }

    // 4. Create token
    /*const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token
    });*/
    sendTokenResponse(user, 200, res);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: 'Server Error'
    });
  }
};
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
}
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
}
exports.logout = async (req, res, next) => {
    res.cookie('token', 'null', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        msg: 'User logged out'
    });
}
