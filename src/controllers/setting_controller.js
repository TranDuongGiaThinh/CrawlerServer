const {HTTP_STATUS} = require('../untils/constants')
const settingService = require('../services/setting_service')

const path = require('path')
const fs = require('fs')

// Lấy nội dung giới thiệu
exports.getIntroduction = async (req, res) => {
    try {
        const introduction = await settingService.getIntroduction()

        res.status(HTTP_STATUS.OK).json({
            introduction: introduction,
            message: 'Lấy nội dung giới thiệu thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy nội dung giới thiệu!',
            error: e.message
        })
    }
}

// Tải xuống ứng dụng
exports.downloadApp = async (req, res) => {
    try {
        const appFilePath = await settingService.getAppFilePath()

        // Đường dẫn đến tệp muốn tải về
        let filePath = path.resolve(appFilePath)

        // Thiết lập header để trình duyệt tự động tải xuống tệp
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`)
        res.setHeader('Content-Type', 'application/octet-stream')

        // Đọc và gửi nội dung tệp về phía client
        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)     
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tải xuống ứng dụng!',
            error: e.message
        })
    }
}

// Tải xuống hướng dẫn sử dụng
exports.downloadInstruction = async (req, res) => {
    try {
        const instructionFilePath = await settingService.getInstructionFilePath()

        // Đường dẫn đến tệp muốn tải về
        let filePath = path.resolve(instructionFilePath)

        // Thiết lập header để trình duyệt tự động tải xuống tệp
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(filePath)}`)
        res.setHeader('Content-Type', 'application/octet-stream')

        // Đọc và gửi nội dung tệp về phía client
        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tải xuống hướng dẫn sử dụng!',
            error: e.message
        })
    }
}

// Cập nhật trang giới thiệu
exports.updateIntroduction = async (req, res) => {
    try {
        const {introduction} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!introduction) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Thực hiện cập nhật
        const newSetting = await settingService.updateIntroduction(introduction)

        res.status(HTTP_STATUS.OK).json({
            setting: newSetting,
            message: 'Cập nhật tra giới thiệu thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật trang giới thiệu!',
            error: e.message
        })
    }
}

// Lưu file
const saveNewFile = async (filePath, serviceFunction) => {
    const dataDir = path.dirname(filePath)

    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
    }

    return serviceFunction(filePath)
}

// Cập nhật file ứng dụng
exports.updateApp = async (req, res) => {
    try {
        // Lấy phần mở rộng của file
        const ext = path.extname(req.file.originalname)
        const fileName = `techmo${ext}`
        const filePath = path.join(__dirname, '../../data', fileName)

        await saveNewFile(filePath, settingService.updateApp)

        res.status(HTTP_STATUS.OK).json({
            message: 'Cập nhật file ứng dụng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật file ứng dụng!',
            error: e.message
        })
    }
}

// Cập nhật file hướng dẫn
exports.updateInstruction = async (req, res) => {
    try {
        // Lấy phần mở rộng của file
        const ext = path.extname(req.file.originalname)
        const fileName = `instruction${ext}`
        const filePath = path.join(__dirname, '../../data', fileName)

        
        await saveNewFile(filePath, settingService.updateInstruction)

        res.status(HTTP_STATUS.OK).json({
            message: 'Cập nhật file hướng dẫn thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật file hướng dẫn!',
            error: e.message
        })
    }
}
