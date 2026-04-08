const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');

const cookieParser = require('cookie-parser');
const helmet = require('helmet');                          
const rateLimit = require('express-rate-limit'); 
const errorMiddleware = require('./middlewares/error.middleware');

// ── Security Middlewares ──────────────────────────────
// Sets secure HTTP headers
app.use(helmet());

// Global rate limit — 100 requests per 15 min per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 15 minutes.',
        data: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limit for auth routes — 10 requests per 15 min
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.',
        data: null,
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(globalLimiter);    // applies to all routes

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const serviceRoutes = require('./routes/service.routes');
const bookingRoutes = require('./routes/booking.routes');
const reviewRoutes = require('./routes/review.routes');
const providerRoutes = require('./routes/provider.routes');


// ── General Middlewares ───────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Mount routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/providers', providerRoutes);

app.get('/' , (req,res)=>{
    res.send('hey new project ');
})

// 404 handler — unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        data: null,
    });
});

// Global error handler — must be last
app.use(errorMiddleware);



module.exports = app;