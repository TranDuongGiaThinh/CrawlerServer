const express = require('express')
const controller = require('../controllers/auto_crawl_controller')

const route = express.Router()

// Kiểm tra cấu hình thu thập tự động đã tồn tại
route.get('/check-auto-crawl-exists/:config_id', controller.checkAutoCrawlExists)

// Kiểm tra quyền tạo cấu hình thu thập tự động
route.get('/check-permission/:user_id', controller.checkPermission)

// Thêm cấu hình thu thập tự động
route.post('/add', controller.add)

// Xóa cấu hình thu thập tự động
route.delete('/delete/:config_id', controller.delete)

module.exports = route
