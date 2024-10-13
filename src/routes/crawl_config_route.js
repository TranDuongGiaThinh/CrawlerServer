const express = require('express')
const controller = require('../controllers/crawl_config_controller')

const route = express.Router()

// Lấy danh sách cấu hình của người dùng
route.get('/get-all-config-of-user/:user_id', controller.getAllConfigOfUser)

// Kiểm tra quyền tạo mới cấu hình của người dùng
route.get('/check-permission/:user_id', controller.checkPermission)

// Kiểm tra tên cấu hình đã tồn tại
route.get('/check-name-exists', controller.checkNameExists)

// Kiểm tra trạng thái hoàn thành của cấu hình
route.get('/check-is-complete/:config_id', controller.checkIsComplete)

// Tạo mới cấu hình
route.post('/add', controller.add)

// Cập nhật cấu hình
route.patch('/update', controller.update)

// Cập nhật trạng thái hoàn thành của cấu hình
route.patch('/complete/:config_id', controller.complete)

module.exports = route
