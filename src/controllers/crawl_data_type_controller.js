const {HTTP_STATUS} = require('../untils/constants')
const crawlDataTypeService = require('../services/crawl_data_type_service')
const crawlTypeService = require('../services/crawl_type_service')

// Lấy danh sách loại cách lấy dữ liệu của loại thu thập
exports.getAllOfCrawlType = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra loại thu thập tồn tại
        const exists = await crawlTypeService.checkExists(id)

        if(!exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                crawl_data_types: [],
                message: 'Loại thu thập không tồn tại'
            })

            return
        }

        // Lấy danh sách
        const crawlDataTypes = await crawlDataTypeService.getAllOfCrawlType(id)

        res.status(HTTP_STATUS.OK).json({
            crawl_data_types: crawlDataTypes,
            message: 'Lấy danh sách loại cách lấy dữ liệu của loại thu thập thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.OK).json({
            crawl_data_types: [],
            message: 'Lỗi khi lấy danh sách loại cách lấy dữ liệu của loại thu thập!',
            error: e.message
        })
    }
}
