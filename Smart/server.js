const express = require("express");
// Ensure `crypto` is available on the global object for environments
// where libraries expect a browser-like `crypto` global (fixes
// "ReferenceError: crypto is not defined" in some containers).
if (typeof globalThis.crypto === 'undefined') {
    // eslint-disable-next-line global-require
    globalThis.crypto = require('crypto');
}
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Mongoose global settings to reduce buffering and surface connection issues quickly
mongoose.set('strictQuery', false);
mongoose.set('bufferCommands', false); // do not buffer model operations
mongoose.set('bufferTimeoutMS', 5000);

// Secure CORS configuration - use ALLOWED_ORIGINS env or default localhost dev origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5175,http://localhost:3000,http://localhost:5173")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Normalize origin and allowedOrigins for comparison
        const normalizedOrigin = origin.replace(/\/$/, '');
        const normalizedAllowed = allowedOrigins.map(o => o.replace(/\/$/, ''));

        // debug log to help diagnose CORS issues in production
        if (process.env.DEBUG_CORS === 'true') {
            console.log('CORS check — origin:', origin);
            console.log('CORS check — allowedOrigins:', normalizedAllowed);
        }

        // allow all origins if ALLOWED_ORIGINS contains '*'
        if (normalizedAllowed.indexOf('*') !== -1) return callback(null, true);

        if (normalizedAllowed.indexOf(normalizedOrigin) !== -1) {
            return callback(null, true);
        }

        console.warn('CORS rejection — origin not allowed:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));

// Basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// DB readiness guard to avoid buffering-timeout errors
const dbReady = require('./middleware/dbReady');
app.use(dbReady);

// Global error handler
const errorHandler = require('./middleware/errorHandler');

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connecté avec succès "))
.catch(err => console.log(err));

mongoose.connection.on('error', (err) => console.error('Mongo connection error', err));
mongoose.connection.on('disconnected', () => console.warn('Mongo disconnected'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// Routes utilisateur 
app.use("/api/utilisateurs", require("./routes/utilisateurRoutes"));

// Routes fichiers
app.use("/api/fichiers",require("./routes/fichierRoutes"));

// Routes alertes
app.use("/api/alertes",require("./routes/alerteRoutes"));

// Routes rapports
app.use("/api/rapports",require("./routes/rapportRoutes"));

// Routes cours
// courses feature removed to focus on network traffic management

// error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
});