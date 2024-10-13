const express = require('express')
const controller = require('../controllers/crawl_detail_controller')

const route = express.Router()

// Thêm chi tiết cấu hình
route.post('/add', controller.add)

// Chỉnh sửa chi tiết cấu hình
route.put('/update', controller.update)

// Xóa chi tiết cấu hình
route.delete('/delete/:id', controller.delete)

// Lấy danh sách chi tiết cấu hình của một cấu hình
route.get('/get-all-of-config/:config_id', controller.getAllOfConfig)

// Kiểm tra tên chi tiết cấu hình của một cấu hình đã tồn tại
route.get('/check-name-exists', controller.checkNameExists)

// Kiểm tra thứ tự thực hiện chi tiết cấu hình của một cấu hình đã tồn tại
route.get('/check-sort-index-exists', controller.checkSortIndexExists)

module.exports = route