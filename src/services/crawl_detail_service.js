const CrawlDetailModel = require('../models/crawl_detail_model')
const Sequelize = require('sequelize')

// Thêm chi tiết cấu hình
exports.add = async (configId, sortIndex, dataTypeId, name, selector, attribute, isPrimaryKey, isDetailUrl, isContainKeywords) => {
    const newCrawlDetail = await CrawlDetailModel.create({
        crawl_config_id: configId,
        sort_index: sortIndex,
        data_type_id: dataTypeId,
        name: name,
        selector: selector,
        attribute: attribute,
        is_primary_key: isPrimaryKey,
        is_detail_url: isDetailUrl,
        is_contain_keywords: isContainKeywords
    })

    return newCrawlDetail
}

// Chỉnh sửa chi tiết cấu hình
exports.update = async (crawlDetailId, sortIndex, dataTypeId, name, selector, attribute, isPrimaryKey, isDetailUrl, isContainKeywords) => {
    const crawlDetail = await CrawlDetailModel.findByPk(crawlDetailId)

    crawlDetail.sort_index = sortIndex,
    crawlDetail.data_type_id = dataTypeId,
    crawlDetail.name = name,
    crawlDetail.selector = selector,
    crawlDetail.attribute = attribute,
    crawlDetail.is_primary_key = isPrimaryKey,
    crawlDetail.is_detail_url = isDetailUrl,
    crawlDetail.is_contain_keywords = isContainKeywords

    await crawlDetail.save()

    return crawlDetail
}

// Xóa chi tiết cấu hình
exports.delete = async (crawlDetailId) => {
    await CrawlDetailModel.destroy({
        where: {
            id: crawlDetailId
        }
    })
}

// Lấy danh sách chi tiết cấu hình của một cấu hình
exports.getAllOfConfig = async (configId) => {
    const crawlDetails = await CrawlDetailModel.findAll({
        where: {crawl_config_id: configId}
    })

    return crawlDetails
}

// Kiểm tra chi tiết cấu hình đã tồn tại
exports.checkExists = async (id) => {
    const crawlDetails = await CrawlDetailModel.findByPk(id)

    return crawlDetails ? true : false
}

// Kiểm tra tên chi tiết cấu hình đã tồn tại
exports.checkNameExists = async (configId, name) => {
    const crawlDetails = await CrawlDetailModel.findOne({
        where: {
            crawl_config_id: configId,
            name: name
        }
    })

    return crawlDetails ? true : false
}
exports.checkNameExistsWithId = async (id, configId, name) => {
    const crawlDetails = await CrawlDetailModel.findOne({
        where: {
            id: {[Sequelize.Op.ne]: id},
            crawl_config_id: configId,
            name: name
        }
    })

    return crawlDetails ? true : false
}

// Kiểm thứ tự sắp xếp của chi tiết cấu hình  đã tồn tại
exports.checkSortIndexExists = async (configId, sortIndex) => {
    const crawlDetails = await CrawlDetailModel.findOne({
        where: {
            crawl_config_id: configId,
            sort_index: sortIndex
        }
    })

    return crawlDetails ? true : false
}
exports.checkSortIndexExistsWithId = async (id, configId, sortIndex) => {
    const crawlDetails = await CrawlDetailModel.findOne({
        where: {
            id: {[Sequelize.Op.ne]: id},
            crawl_config_id: configId,
            sort_index: sortIndex
        }
    })

    return crawlDetails ? true : false
}
