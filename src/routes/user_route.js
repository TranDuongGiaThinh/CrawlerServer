const express = require('express')
const controller = require('../controllers/user_controller')

const route = express.Router()

// Đăng ký tài khoản người dùng
route.post('/register', controller.register)

// Kiểm tra tên đăng nhập đã tồn tại
route.get('/check-username-exists/:username', controller.checkUsernameExists)

// Kiểm tra đăng nhập
route.post('/check-login', controller.checkLogin)

// Lấy thông tin tài khoản người dùng
route.get('/get-user/:id', controller.getUser)

// Lấy danh sách người dùng
route.get('/get-all-user', controller.getAllUser)

// Tìm kiếm người dùng bằng từ khóa
route.get('/search-user/:keyword', controller.searchUser)

// Khóa tài khoản người dùng
route.patch('/lock-user/:id', controller.lockUser)

// Mở khóa tài khoản người dùng
route.patch('/unlock-user/:id', controller.unlockUser)

module.exports = route
