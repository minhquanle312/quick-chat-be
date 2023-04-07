// const multer = require('multer')
const AppError = require('../utils/appError')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')

// const multerStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'public/img/users')
//   },
//   filename: (req, file, callback) => {
//     // user-:userId-:date
//     // user-12343452-345353324.jpeg
//     const ext = file.mimetype.split('/')[1]
//     callback(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//   },
// })

// const multerFilter = (req, file, callback) => {
//   if (file.mimetype.startsWith('image')) {
//     callback(null, true)
//   } else {
//     callback(
//       new AppError('Not an image! Please upload only images.', 400),
//       false
//     )
//   }
// }

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// })

// exports.uploadUserPhoto = upload.single('photo')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // * 1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    )
  }

  // * 2. Update user document
  const filteredBody = filterObj(req.body, 'name', 'email')
  // if (req.file) filteredBody.photo = req.file.filename

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not define! Please use sign up instead',
  })
}

exports.getUser = factory.getOne(User, {
  path: 'contacts',
  select: '-__v -passwordChangedAt -contacts -role',
  options: { maxDepth: 1 },
})
exports.getAllUsers = factory.getAll(User)

// * Do NOT update password with this
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
