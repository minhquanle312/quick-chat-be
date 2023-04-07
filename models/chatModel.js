const mongoose = require('mongoose')
const AppError = require('../utils/appError')

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
      },
    ],
    groupAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
)

chatSchema.virtual('messages', {
  ref: 'Message',
  foreignField: 'chat',
  localField: '_id',
})

chatSchema.pre('save', async function (next) {
  const membersInNewChat = this.members
  const chatsDocument = await this.constructor.find({
    isGroup: false,
    members: { $all: membersInNewChat },
    _id: { $ne: this._id },
  })

  if (chatsDocument.length > 0 && !this.isGroup) {
    return next(new AppError('This chat have been exists'))
  }

  next()
})

chatSchema.pre('find', function (next) {
  this.populate({
    path: 'messages',
    select: '-__v',
    options: {
      sort: { createdAt: -1 },
      limit: 1,
    },
  })

  next()
})

chatSchema.virtual('latestMessage').get(function () {
  return this?.messages ? this?.messages[this?.messages.length - 1] : null
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
