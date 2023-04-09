const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
// const hpp = require('hpp')
const cors = require('cors')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
// const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const chatRouter = require('./routes/chatRoutes')
const messageRouter = require('./routes/messageRoutes')
const { ALLOW_ORIGIN } = require('./configs/corsConfig')
// const reviewRouter = require('./routes/reviewRoutes')

const app = express()

app.use(
  cors({
    origin: process.env.NODE_ENV === 'development' ? '*' : ALLOW_ORIGIN,
    optionsSuccessStatus: 200,
  })
)

// * Set security HTTP headers
app.use(helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// * limit 200 request in 1 minutes
const limiter = rateLimit({
  max: 200,
  windowMs: 1 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
})
app.use('/api', limiter)

// * Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// * Data sanitization against noSQL query injection
app.use(mongoSanitize())

// * Data sanitization against XSS
app.use(xss())

// * Serving static files
app.use(express.static(`${__dirname}/public`))

// * Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  // console.log(req.headers)

  next()
})

app.use('/api/v1/users', userRouter)
app.use('/api/v1/chats', chatRouter)
app.use('/api/v1/messages', messageRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

// * all errors in catchAsync function go to globalErrorHandler
app.use(globalErrorHandler)

module.exports = app
