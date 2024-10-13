const express = require('express')
const controller = require('../controllers/backup_controller')

const multer = require('multer')
const path = require('path')

const route = express.Router()

// Cấu hình multer để lưu file tạm thời
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../temp'))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

// Tạo file backup hệ thống
route.get('/create-backup', controller.createBackup)

// Khôi phục lại dữ liệu hệ thống
route.post('/restore', upload.single('file'), controller.restore)

module.exports = route
