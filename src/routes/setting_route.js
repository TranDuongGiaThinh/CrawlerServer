const express = require('express')
const settingController = require('../controllers/setting_controller')
const path = require('path')
const multer = require('multer')

const route = express.Router()

// Đặt đường dẫn đến thư mục 'data'
const dataDir = path.join(__dirname, '../../', 'data')

// Cấu hình `multer` cho file ứng dụng
const appStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dataDir)
    },
    filename: (req, file, cb) => {
        // Lấy phần mở rộng của file
        const ext = path.extname(file.originalname)

        const fileName = `techmo${ext}`
        cb(null, fileName)
    }
})

// Cấu hình `multer` cho file hướng dẫn
const instructionStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dataDir)
    },
    filename: (req, file, cb) => {
        // Lấy phần mở rộng của file
        const ext = path.extname(file.originalname)

        const fileName = `instruction${ext}`
        cb(null, fileName)
    }
})

const uploadApp = multer({ storage: appStorage })
const uploadInstruction = multer({ storage: instructionStorage })

// Lấy nội dung giới thiệu
route.get('/get-introduction', settingController.getIntroduction)

// Tải xuống ứng dụng
route.get('/download-app', settingController.downloadApp)

// Tải xuống hướng dẫn sử dụng
route.get('/download-instruction', settingController.downloadInstruction)

// Cập nhật trang giới thiệu
route.patch('/update-introduction', settingController.updateIntroduction)

// Cập nhật file ứng dụng
route.patch('/update-app', uploadApp.single('file'), settingController.updateApp)

// Cập nhật file hướng dẫn
route.patch('/update-instruction', uploadInstruction.single('file'), settingController.updateInstruction)

module.exports = route
