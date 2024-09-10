const express = require('express')
const renewalPackageController = require('../controllers/renewal_package_controller')

const route = express.Router()

// Lấy danh sách gói gia hạn
route.get('/get-all', renewalPackageController.getAll)

// Kiểm tra tên gói gia hạn đã tồn tại
route.get('/check-name-exists', renewalPackageController.checkNameExists)

// Thêm gói gia hạn
route.post('/add', renewalPackageController.add)

// Cập nhật gói gia hạn
route.put('/update', renewalPackageController.update)

// Xóa gói gia hạn
route.patch('/delete/:id', renewalPackageController.delete)

module.exports = route
