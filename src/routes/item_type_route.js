const express = require('express')
const itemTypeController = require('../controllers/item_type_controller')

const route = express.Router()

// Lấy danh sách chủ đề thu thập mà người dùng đã tạo
route.get('/get-all-item-type-of-user/:user_id', itemTypeController.getAllItemTypeOfUser)

// Kiểm tra tên chủ đề thu thập đã tồn tại
route.get('/check-name-exists', itemTypeController.checkNameExists)

// Kiểm tra chủ đề có đang được sử dụng
route.get('/check-item-type-is-using/:id', itemTypeController.checkItemTypeIsUsing)

// Thêm chủ đề thu thập mới
route.post('/add', itemTypeController.add)

// Chỉnh sửa chủ đề thu thập
route.put('/update', itemTypeController.update)

// Xóa chủ đề thu thập
route.delete('/delete/:id', itemTypeController.delete)

module.exports = route
