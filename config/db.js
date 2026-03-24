const mongoose = require('mongoose');
const connectDB = async() =>{
    mongoose.set('strictQuery',true);
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`Mongo Connected : ${conn.connection.host}`);
}
module.exports = connectDB;