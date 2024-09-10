const {HTTP_STATUS} = require('../untils/constants')
const crawlResultTypeService = require('../services/crawl_result_type_service')

// Lấy danh sách loại kết quả trả về khi loại thu thập
exports.getAll = async (req, res) => {
    try {
        const crawlResultTypes = await crawlResultTypeService.getAll()

        res.status(HTTP_STATUS.OK).json({
            crawl_result_types: crawlResultTypes,
            message: 'Lấy danh sách loại kết quả trả về khi loại thu thập thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            crawl_result_types: [],
            message: 'Lỗi khi lấy danh sách loại kết quả trả về khi loại thu thập!',
            error: e.message
        })
    }
}
