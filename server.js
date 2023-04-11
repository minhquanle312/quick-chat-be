const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION 💥💥💥 Shuting down ...')
  console.log(err.name, err.message)
  process.exit(1)
})

dotenv.config({ path: './config.env' })

const { app, server } = require('./app')

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

mongoose.connect(DB).then(con => {
  console.log('DB connection successful')
})

const port = process.env.PORT || 3000
const serverRunning = server.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

process.on('uncaughtException', err => {
  console.log('UNHANDLER REJECTION 💥💥💥 Shuting down ...')
  console.log(err.name, err.message)
  serverRunning.close(() => {
    process.exit(1)
  })
})
