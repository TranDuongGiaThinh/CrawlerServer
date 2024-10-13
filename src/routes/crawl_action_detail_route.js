const express = require('express')
const controller = require('../controllers/crawl_action_detail_controller')

const route = express.Router()

// Thêm chi tiết hành động của một cấu hình
route.post('/add', controller.add)

// Chỉnh sửa chi tiết hành động của một cấu hình
route.put('/update', controller.update)

// Xóa chi tiết hành động của một cấu hình
route.delete('/delete/:id', controller.delete)

// Lấy danh sách hành động của một cấu hình
route.get('/get-all-of-config/:config_id', controller.getAllOfConfig)

// Kiểm tra thứ tự thực hiện của hành động đã tồn tại
route.get('/check-sort-index-exists', controller.checkSortIndexExists)

module.exports = route
