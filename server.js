///// import

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const auth = require('./routes/auth');
const restaurant = require('./routes/restaurant');
const reservation = require('./routes/reservation');
const errorHandler = require('./middleware/error');

///// security

//// connect to database
///server.js
const app = express();
app.use(cors({
    origin: true, // ยอมรับจาก Next.js ของเรา
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

connectDB();
////routes
app.use('/auth', auth);
app.use('/restaurant', restaurant);
app.use('/reservation', reservation);

//// error handler
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

