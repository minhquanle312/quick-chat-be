const mongoose = require('mongoose')
const Chat = require('./chatModel')

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    photos: [{ type: String }],
    sendUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Message must have send user id'],
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'Message must belong to a chat'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
