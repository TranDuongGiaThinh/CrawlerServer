const CrawlDataTypeModel = require('../models/crawl_data_type_model')

// Lấy danh sách loại cách lấy dữ liệu của loại thu thập
exports.getAllOfCrawlType = async (id) => {
    const crawlDataTypes = await CrawlDataTypeModel.findAll({
        where: {
            crawl_type_id: id
        }
    })

    return crawlDataTypes
}

// Lấy loại cách lấy dữ liệu của loại thu thập
exports.get = async (id) => {
    const crawlDataType = await CrawlDataTypeModel.findByPk(id)

    return crawlDataType
}
