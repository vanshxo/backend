const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { connectDb } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// const authRouter = require('./auth/routes');
// const socialSpaceRouter = require('./socialSpaces/routes');
// const membershipRouter = require('./memberships/routes');
// const linkedinRouter = require('./socialAccounts/routes');
// const orgRouter = require('./linkedin_fetch/routes');
// const publishlinkedinRouter = require('./publishOnLinkedin/routes');
// const cron = require('node-cron');
// const { refreshLinkedInTokens } = require('./cron/refreshLinkedin');
// const { errorHandler } = require('./middleware/error');
const session = require('express-session');
const passport = require('passport');
// const { refreshExpiredOrgData } = require('./Utils/orgRefresh');
// const { refreshExpiredPosts } = require('./Utils/postCacheRefresh');

// Add BullMQ worker import
// const { startPostWorker } = require('./queue/postWorker');

// require('./config/passport');

dotenv.config();
const app = express();
const port = process.env.PORT || 8081;

// ======================
// Security Middlewares
// ======================
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ======================
// Standard Middlewares
// ======================
app.use(morgan('combined'));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SECRET_STRING || 'vash_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// ======================
// Database Connection
// ======================
connectDb();

// ======================
// Scheduled Jobs
// ======================
// cron.schedule('*/15 * * * *', refreshLinkedInTokens);
// cron.schedule('0 * * * *', async () => {
//   console.log('Starting LinkedIn org data refresh job...');
//   await refreshExpiredOrgData();
//   console.log('LinkedIn org data refresh job completed.');
// });
// cron.schedule('*/30 * * * *', refreshExpiredPosts);

// ======================
// Routes
// ======================
// app.use('/api/auth', authRouter);

app.use('/api/auth', authRoutes);
// app.use('/api/socialSpaces', socialSpaceRouter);
// app.use('/api/members', membershipRouter);
// app.use('/api/socialAccounts', linkedinRouter);
// app.use('/api/org', orgRouter);
// app.use('/api/publinkedin', publishlinkedinRouter);

// ======================
// Error Handling
// ======================
// app.use(errorHandler);

// ======================
// Server Initialization
// ======================
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  
  // Start BullMQ worker AFTER server starts
//   startPostWorker();
  console.log('BullMQ worker started');
});

// ======================
// Graceful Shutdown
// ======================
const shutdown = async (signal) => {
  console.log(`🛑 Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    await mongoose.disconnect();
    console.log('⛔️ Server and DB connections closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
