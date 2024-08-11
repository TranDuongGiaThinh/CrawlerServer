const {HTTP_STATUS} = require('../untils/constants')
const crawlTypeService = require('../services/crawl_type_service')

// Lấy danh sách loại cách lấy dữ liệu của loại thu thập
exports.getAll = async (req, res) => {
    try {
        const crawlTypes = await crawlTypeService.getAll()

        res.status(HTTP_STATUS.OK).json({
            crawl_types: crawlTypes,
            message: 'Lấy danh sách loại thu thập thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.OK).json({
            crawl_types: [],
            message: 'Lỗi khi lấy danh sách loại thu thập!',
            error: e.message
        })
    }
}
