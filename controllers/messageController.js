const Message = require('./../models/messageModel')
const Chat = require('./../models/chatModel')
const factory = require('./handlerFactory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.checkUserInMembersOfChat = catchAsync(async (req, res, next) => {
  if (req.params.chatId) {
    const chat = await Chat.findById(req.params.chatId)
    const membersInChat = chat.members.map(memberId => memberId.toString())

    if (!membersInChat.includes(req.user.id)) {
      return next(new AppError('This User is not belong to this Chat', 404))
    }
  }

  next()
})

exports.setChatIdAndUserId = catchAsync(async (req, res, next) => {
  // * Allow nested routes
  if (!req.body.chat) req.body.chat = req.params.chatId
  if (!req.body.sendUser) req.body.sendUser = req.user.id

  next()
})

exports.deleteAllMessageInChat = catchAsync(async (req, res, next) => {
  const chatId = req.params.id

  await Message.deleteMany({ chat: chatId })

  next()
})

exports.getAllMessages = factory.getAll(Message)
exports.getMessage = factory.getOne(Message)
exports.createMessage = factory.createOne(Message)
exports.updateMessage = factory.updateOne(Message)
exports.deleteMessage = factory.deleteOne(Message)
