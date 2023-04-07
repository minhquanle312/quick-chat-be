const express = require('express')
const messageController = require('./../controllers/messageController')
const authController = require('./../controllers/authController')

// * mergeParams allow review route know :chatId params
const router = express.Router({ mergeParams: true })

router.use(authController.protect)

router
  .route('/')
  .get(
    messageController.checkUserInMembersOfChat,
    messageController.getAllMessages
  )
  .post(
    messageController.checkUserInMembersOfChat,
    messageController.setChatIdAndUserId,
    messageController.createMessage
  )

router
  .route('/:id')
  .get(messageController.getMessage)
  .patch(messageController.updateMessage)
  .delete(messageController.deleteMessage)

module.exports = router
