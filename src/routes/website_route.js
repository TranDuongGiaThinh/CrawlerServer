const express = require('express')
const websiteController = require('../controllers/website_controller')

const route = express.Router()

// Lấy danh sách website mà người dùng tạo
route.get('/get-all-website-of-user/:id', websiteController.getAllWebsiteOfUser)

// Thêm website thu thập
route.post('/add', websiteController.add)

// Chỉnh sửa website
route.put('/update', websiteController.update)

// Xóa website
route.delete('/delete/:id', websiteController.delete)

// Kiểm tra tên website đã tồn tại
route.get('/check-name-exists', websiteController.checkNameExists)

// Kiểm tra url website đã tồn tại
route.get('/check-url-exists', websiteController.checkUrlExists)

// Kiểm tra website đang được sử dụng
route.get('/check-is-using/:id', websiteController.checkIsUsing)

// Kiểm tra đường dẫn hợp lệ
route.get('/check-url-valid', websiteController.checkUrlValid)

module.exports = route
