const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDb = require('./config/db');
const cookieParser = require('cookie-parser')

// Route imports
const authRoutes = require('./routes/auth.routes');


connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Mount routes
app.use('/api/auth', authRoutes);

app.get('/' , (req,res)=>{
    res.send('hey new project ');
})



module.exports = app;