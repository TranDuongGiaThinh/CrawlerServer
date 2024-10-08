const express = require('express')
const controller = require('../controllers/crawling_controller')

const route = express.Router()

// Thực hiện thu thập
route.post('/crawl-data', controller.crawlData)

module.exports = route