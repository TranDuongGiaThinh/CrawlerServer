const express = require('express')
const controller = require('../controllers/item_controller')

const route = express.Router()

// Lấy danh sách dữ liệu mà người dùng đã thu thập
route.get('/get-all-item-of-user/:user_id', controller.getAllItemOfUser)

// Lọc dữ liệu
route.get('/filter/:user_id', controller.filter)

// Kiểm tra quyền xuất dữ liệu
route.get('/check-export-permission/:user_id', controller.checkExportPermission)

// Xuất dữ liệu
route.get('/export/:user_id', controller.export)

// Lấy danh sách từ khóa gợi ý tìm kiếm dữ liệu thu thập
route.get('/get-search-suggestions/:keyword', controller.getSearchSuggestions)

// Tìm kiếm dữ liệu thu thập bằng từ khóa
route.get('/search', controller.search)

module.exports = route