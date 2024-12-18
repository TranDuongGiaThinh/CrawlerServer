const CrawlActionTypeModel = require('../models/crawl_action_type_model')

// Lấy danh sách loại hành động
exports.getAll = async () => {
    const crawlActionTypes = await CrawlActionTypeModel.findAll()

    return crawlActionTypes
}

// Lấy loại hành động
exports.get = async (id) => {
    const crawlActionType = await CrawlActionTypeModel.findByPk(id)

    return crawlActionType
}