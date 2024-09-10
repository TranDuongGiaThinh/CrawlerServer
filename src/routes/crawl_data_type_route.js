const express = require('express')
const crawlDataTypeController = require('../controllers/crawl_data_type_controller')

const route = express.Router()

// Lấy danh sách loại cách lấy dữ liệu của loại thu thập
route.get('/get-all-of-crawl-type/:id', crawlDataTypeController.getAllOfCrawlType)

module.exports = route
