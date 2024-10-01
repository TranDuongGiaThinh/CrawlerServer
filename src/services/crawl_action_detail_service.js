const CrawlActionDetailModel = require('../models/crawl_action_detail_model')
const CrawlDetailModel = require('../models/crawl_detail_model')
const Sequelize = require('sequelize')

// Thêm chi tiết hành động
exports.add = async (configId, sortIndex, actionTypeId, selector, value, isList) => {
    const newCrawlActionDetail = await CrawlActionDetailModel.create({
        crawl_config_id: configId,
        action_type_id: actionTypeId,
        sort_index: sortIndex,
        selector: selector,
        value: value,
        is_list: isList
    })

    return newCrawlActionDetail
}

// Chỉnh sửa chi tiết hành động
exports.update = async (crawlActionDetailId, sortIndex, actionTypeId, selector, value, isList) => {
    const crawlActionDetail = await CrawlActionDetailModel.findByPk(crawlActionDetailId)

    crawlActionDetail.sort_index = sortIndex,
    crawlActionDetail.action_type_id = actionTypeId,
    crawlActionDetail.value = value,
    crawlActionDetail.selector = selector,
    crawlActionDetail.is_list = isList

    await crawlActionDetail.save()

    return crawlActionDetail
}

// Xóa chi tiết hành động
exports.delete = async (crawlActionDetailId) => {
    await CrawlActionDetailModel.destroy({
        where: {
            id: crawlActionDetailId
        }
    })
}

// Lấy danh sách chi tiết hành động của một cấu hình
exports.getAllOfConfig = async (configId) => {
    const crawlActionDetails = await CrawlActionDetailModel.findAll({
        where: {crawl_config_id: configId}
    })

    return crawlActionDetails
}

// Kiểm tra chi tiết hành động đã tồn tại
exports.checkExists = async (id) => {
    const crawlActionDetail = await CrawlActionDetailModel.findByPk(id)

    return crawlActionDetail ? true : false
}

// Kiểm thứ tự sắp xếp của chi tiết hành động  đã tồn tại
exports.checkSortIndexExists = async (configId, sortIndex) => {
    const crawlDetail = await CrawlDetailModel.findOne({
        where: {
            crawl_config_id: configId,
            sort_index: sortIndex
        }
    })

    const crawlActionDetail = await CrawlActionDetailModel.findOne({
        where: {
            crawl_config_id: configId,
            sort_index: sortIndex
        }
    })

    return crawlDetail || crawlActionDetail ? true : false
}
exports.checkSortIndexExistsWithId = async (id, configId, sortIndex) => {
    const crawlDetail = await CrawlDetailModel.findOne({
        where: {
            crawl_config_id: configId,
            sort_index: sortIndex
        }
    })

    const crawlActionDetail = await CrawlActionDetailModel.findOne({
        where: {
            id: {[Sequelize.Op.ne]: id},
            crawl_config_id: configId,
            sort_index: sortIndex
        }
    })

    return crawlDetail || crawlActionDetail ? true : false
}
