const CrawlTypeModel = require('../models/crawl_type_model')

// Kiểm tra loại thu thập đã tồn tại
exports.checkExists = async (id) => {
    const crawlType = await CrawlTypeModel.findByPk(id)

    if (crawlType) return true

    return false
}

// Lấy danh sách loại thu thập
exports.getAll = async () => {
    const crawlTypes = await CrawlTypeModel.findAll()

    return crawlTypes || []
}
