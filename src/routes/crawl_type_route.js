const express = require('express')
const crawlTypeController = require('../controllers/crawl_type_controller')

const route = express.Router()

// Lấy danh sách loại thu thập
route.get('/get-all', crawlTypeController.getAll)

module.exports = route
