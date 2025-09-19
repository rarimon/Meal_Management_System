import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import * as bodyParser from "express";
import routers from './app/routes/api.js';
import {
    PORT,
    REQUEST_LIMIT_TIME,
    REQUEST_LIMIT_NUMBER,
    MAX_JSON_SIZE,
    WEB_CACHE,
    MONOGODB_URL
} from './app/config/config.js'


const app = express();

// Global Application Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(express.json({limit:MAX_JSON_SIZE}));

// Rate Limiting Middleware
const limiter = rateLimit({windowMs: REQUEST_LIMIT_TIME, max: REQUEST_LIMIT_NUMBER});
app.use(limiter);


// Cache
app.set("etag", WEB_CACHE);

// Mongodb Connecton
mongoose.connect(MONOGODB_URL, {autoIndex: true})
    .then(() => {
        console.log('MongoDB connected successfully')
    })
    .catch(err => {
        console.error('MongoDB connection error:', err)
    });




// Confire API Routes
app.use('/api/v1', routers);




// Ranning Express server
app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});