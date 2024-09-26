const {HTTP_STATUS} = require('../untils/constants')
const crawlDetailService = require('../services/crawl_detail_service')

// Thêm chi tiết cấu hình
exports.add = async (req, res) => {
    try {
        
        res.status(HTTP_STATUS.OK).json({
            message: 'Thêm mới chi tiết cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thêm mới chi tiết cấu hình!',
            error: error.message
        })
    }
}

// Chỉnh sửa chi tiết cấu hình
exports.update = async (req, res) => {
    try {
        
        res.status(HTTP_STATUS.OK).json({
            message: 'Cập nhật chi tiết cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật chi tiết cấu hình!',
            error: error.message
        })
    }
}

// Xóa chi tiết cấu hình
exports.delete = async (req, res) => {
    try {
        
        res.status(HTTP_STATUS.OK).json({
            message: 'Xóa chi tiết cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa chi tiết cấu hình!',
            error: error.message
        })
    }
}

// Lấy danh sách chi tiết cấu hình của một cấu hình
exports.getAll = async (req, res) => {
    try {
        
        res.status(HTTP_STATUS.OK).json({
            message: 'Lấy danh sách chi tiết cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách chi tiết cấu hình!',
            error: error.message
        })
    }
}
