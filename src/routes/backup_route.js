const express = require('express')
const controller = require('../controllers/backup_controller')

const route = express.Router()

// Tạo file backup hệ thống
route.get('/create-backup', controller.createBackup)

// Khôi phục lại dữ liệu hệ thống
route.post('/restore', controller.restore)

module.exports = route
