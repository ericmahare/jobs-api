require('dotenv').config();
require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors')
const rateLimiter = require('rate-limiter')
const xss = require('xss-clean')

// DB connection
const connectDB = require('./db/connect')
// routers
const authRoutes = require('./routes/auth')
const jobRoutes = require('./routes/jobs')
// middlewares
const authMiddleware = require('./middleware/authentication')
const app = express();
// error handler
const notFoundMiddleware = require('./middleware/not-found');
// const errorHandlerMiddleware = require('./middleware/error-handler');

/* *****middlewares***** */
app.use(express.json());
// security setup
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 13 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
}))
app.use(helmet())
app.use(cors())
app.use(xss())
//routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/jobs', [authMiddleware, jobRoutes])
app.use(authMiddleware)
app.use(notFoundMiddleware);
// app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
