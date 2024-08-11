const {HTTP_STATUS} = require('../untils/constants')
const crawlActionTypeService = require('../services/crawl_action_type_service')

// Lấy danh sách loại hành động
exports.getAll = async (req, res) => {
    try {
        const crawlActionTypes = await crawlActionTypeService.getAll()

        res.status(HTTP_STATUS.OK).json({
            crawl_action_types: crawlActionTypes,
            message: 'Lấy danh sách loại hành động thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.OK).json({
            crawl_action_types: [],
            message: 'Lỗi khi lấy danh sách loại hành động!',
            error: e.message
        })
    }
}
