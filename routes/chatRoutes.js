const express = require('express')
const chatController = require('./../controllers/chatController')
const messageController = require('./../controllers/messageController')
const authController = require('./../controllers/authController')
const messageRouter = require('./messageRoutes')

const router = express.Router()

router.use(authController.protect)

router.use('/:chatId/message', messageRouter)

router.route('/getMyChats').get(chatController.getAllChats)

router
  .route('/')
  .get(authController.restrictTo('admin'), chatController.getAllChats)
  .post(chatController.createChat)

router
  .route('/:id')
  .get(chatController.getChat)
  .patch(chatController.updateChat)
  .delete(messageController.deleteAllMessageInChat, chatController.deleteChat)

module.exports = router
