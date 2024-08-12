const express = require('express')
const crawlResultTypeController = require('../controllers/crawl_result_type_controller')

const route = express.Router()

// Lấy danh sách loại kết quả trả về khi thu thập
route.get('/get-all', crawlResultTypeController.getAll)

module.exports = route
