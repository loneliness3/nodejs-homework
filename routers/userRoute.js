const express = require('express')
const userRouter = express.Router();

const userController = require('../controllers/userController')

userRouter.route("/users")
.get(userController.getUsers)
.post(userController.addUsers)

userRouter.route("/users/:id")
.patch(userController.editUser)
.delete(userController.deleteUsers)

module.exports = userRouter
