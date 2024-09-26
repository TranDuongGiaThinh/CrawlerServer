const express = require('express')
const controller = require('../controllers/crawl_detail_controller')

const route = express.Router()

// Thêm chi tiết cấu hình
route.post('/add', controller.add)

// Chỉnh sửa chi tiết cấu hình
route.put('/update', controller.update)

// Xóa chi tiết cấu hình
route.delete('/delete/:config_id', controller.delete)

// Lấy danh sách chi tiết cấu hình của một cấu hình
route.get('/get-all-of-config/:config_id', controller.getAll)

module.exports = route