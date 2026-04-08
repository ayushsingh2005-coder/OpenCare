const mongoose = require('mongoose');

function connectToDb(){
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 6000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        family: 4 // Use IPv4, skip trying IPv6
    })
    .then(() => console.log('connected to DB'))
    .catch(err => console.error('DB connection error:', err));
}

module.exports = connectToDb;