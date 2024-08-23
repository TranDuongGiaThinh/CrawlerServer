const express = require('express')
const packageUserController = require('../controllers/package_user_controller')

const route = express.Router()

// Lấy danh sách lịch sử đăng ký gói của người dùng
route.get('/get-all-of-user/:id', packageUserController.getAllOfUser)

// Lấy gói đang được sử dụng của người dùng
route.get('/get-package-is-using/:id', packageUserController.getPackageIsUsing)

// Thêm thông tin đăng ký gói mới
route.post('/add', packageUserController.add)

module.exports = route
