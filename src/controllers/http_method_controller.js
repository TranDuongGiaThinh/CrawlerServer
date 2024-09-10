const {HTTP_STATUS} = require('../untils/constants')
const httpMethodService = require('../services/http_method_service')

// Lấy danh sách loại phương thức gọi API
exports.getAll = async (req, res) => {
    try {
        const httpMethods = await httpMethodService.getAll()

        res.status(HTTP_STATUS.OK).json({
            http_method: httpMethods,
            message: 'Lấy danh sách loại phương thức gọi API thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            http_method: [],
            message: 'Lỗi khi lấy danh sách loại phương thức gọi API!',
            error: e.message
        })
    }
}
