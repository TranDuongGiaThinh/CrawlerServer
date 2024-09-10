const express = require('express')
const userTypeController = require('../controllers/user_type_contoller')

const route = express.Router()

// Lấy danh sách gói thành viên
route.get('/get-all', userTypeController.getAll)

// Kiểm tra tên gói thành viên đã tồn tại
route.get('/check-name-exists', userTypeController.checkNameExists)

// Thêm gói thành viên
route.post('/add', userTypeController.add)

// Cập nhật gói thành viên
route.put('/update', userTypeController.update)

// Xóa gói thành viên
route.patch('/delete/:id', userTypeController.delete)

module.exports = route
