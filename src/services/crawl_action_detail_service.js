const CrawlActionDetailModel = require('../models/crawl_action_detail_model')
const CrawlDetailModel = require('../models/crawl_detail_model')
const Sequelize = require('sequelize')

const crawlActionDetailService = require('../services/crawl_action_type_service')

const {ACTIONS} = require('../untils/constants')

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

// Hàm thực hiện xử lý các hành động
exports.handleActions = async (page, actions) => {
    try {
        for (const action of actions) {
            const actionType = (await crawlActionDetailService.get(action.action_type_id)).type

            if (actionType == ACTIONS.CLICK_WHEN_APPEAR) {
                clickWhenAppear(page, action.selector)
            } else if (actionType == ACTIONS.SHOW_ALL) {
                await showAll(page, action.selector)
            }
        }
    } catch (error) {
        console.log('Lỗi khi thực hiện xử lý các hành động trong handleActions():', error)
    }
}

// Xử lý sự kiện Show all
const showAll = async (page, selector) => {	
    while (true) {	
        try {	
            await page.click(selector)
            await page.waitForSelector(selector, { visible: true, timeout: 5000 })

            // Chờ 0.5 giây	
            await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {	
            break
        }
    }
}

// Xử lý sự kiện clickWhenAppear
const clickWhenAppear = async (page, selector) => {
    while (!page.isClosed()) {
        try {
            // Kiểm tra phần tử có tồn tại
            const isElementVisible = await page.evaluate((selector) => {
                const element = document.querySelector(selector)
                return element != null
            }, selector)

            // Click phần tử nếu có
            if (isElementVisible) {
                await page.click(selector)
                await new Promise(resolve => setTimeout(resolve, 500))
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000))
            }
        } catch (error) {	
            break
        }
    }
}
