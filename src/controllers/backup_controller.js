const {HTTP_STATUS} = require('../untils/constants')
const backupService = require('../services/backup_service')

// Tạo file backup hệ thống
exports.createBackup = async (req, res) => {
    try {
        const data = await backupService.getAllData()

        res.status(HTTP_STATUS.OK).json({ 
            data: data,
            message: 'Tạo bản sao lưu thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            message: 'Lỗi khi tạo bản sao lưu!',
            error: e.message
        })
    }
}

// Khôi phục lại dữ liệu hệ thống
exports.restore = async (req, res) => {
    try {
        const {data} = req.body

        await backupService.restore(data)
        
        res.status(HTTP_STATUS.OK).json({
            message: 'Khôi phục dữ liệu thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi khôi phục dữ liệu!',
            error: error.message
        })
    }
}
