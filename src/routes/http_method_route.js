const express = require('express')
const httpMethodController = require('../controllers/http_method_controller')

const route = express.Router()

// Lấy danh sách loại phương thức gọi API
route.get('/get-all', httpMethodController.getAll)

module.exports = route
