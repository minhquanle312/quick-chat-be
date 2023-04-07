const Chat = require('./../models/chatModel')
const factory = require('./handlerFactory')

exports.getAllChats = factory.getAll(Chat)
exports.getChat = factory.getOne(Chat, {
  path: 'messages',
  select: '-__v',
})
exports.createChat = factory.createOne(Chat)
exports.updateChat = factory.updateOne(Chat)
exports.deleteChat = factory.deleteOne(Chat)
