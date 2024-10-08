const CrawlResultTypeModel = require('../models/crawl_result_type_model')

// Lấy danh sách loại kết quả trả về khi thu thập
exports.getAll = async () => {
    const crawlDataTypes = await CrawlResultTypeModel.findAll()

    return crawlDataTypes
}

// Lấy loại kết quả trả về khi thu thập
exports.get = async (id) => {
    const crawlDataType = await CrawlResultTypeModel.findByPk(id)

    return crawlDataType
}
