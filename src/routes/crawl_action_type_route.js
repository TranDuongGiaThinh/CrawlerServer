const express = require('express')
const crawlActionTypeController = require('../controllers/crawl_action_type_controller')

const route = express.Router()

// Lấy danh sách loại hành động
route.get('/get-all', crawlActionTypeController.getAll)

module.exports = route
