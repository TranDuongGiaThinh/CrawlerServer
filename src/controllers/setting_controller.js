const {HTTP_STATUS} = require('../untils/constants')
const settingService = require('../services/setting_service')

const path = require('path')
const fs = require('fs');

// Đặt đường dẫn đến thư mục 'data'
const dataDir = path.join(__dirname, '../../', 'data')

// Lấy nội dung giới thiệu
exports.getIntroduction = async (req, res) => {
    try {
        const introduction = await settingService.getIntroduction()

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
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

// Lấy nội dung footer
exports.getFooter = async (req, res) => {
    try {
        const footer = await settingService.getFooter()

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            footer: footer,
            message: 'Lấy nội dung footer thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy nội dung footer!',
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

        res.status(HTTP_STATUS.OK).json({message: 'Tải xuống thành công!'})        
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

        res.status(HTTP_STATUS.OK).json({message: 'Tải xuống thành công!'})
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

// Cập nhật footer
exports.updateFooter = async (req, res) => {
    try {
        const {footer} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!footer) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Thực hiện cập nhật
        const newSetting = await settingService.updateFooter(footer)

        res.status(HTTP_STATUS.OK).json({
            setting: newSetting,
            message: 'Cập nhật footer thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật footer!',
            error: e.message
        })
    }
}

// Thực hiện lưu file
function saveNewFile(req, res, filePath, callback) {
    const fileStream = fs.createWriteStream(filePath)

    req.pipe(fileStream)

    fileStream.on('finish', () => {
        res.status(HTTP_STATUS.OK).json({ message: 'File được cập nhật thành công!' })

        callback(filePath) 
    })

    fileStream.on('error', (err) => {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lưu file!',
            error: err.message
        })
    })
}

// Xóa tất cả các file có basename bắt đầu bằng phần tên đã cho
function deleteOldFiles(basename, callback) {
    fs.readdir(dataDir, (err, files) => {
        if (err) return callback(err)
        
        // Tạo một danh sách các file cần xóa
        const filesToDelete = files.filter(file => path.basename(file, path.extname(file)).startsWith(basename))

        // Xóa từng file
        let remaining = filesToDelete.length
        if (remaining === 0) return callback(null)

        filesToDelete.forEach(file => {
            const filePath = path.join(dataDir, file)
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) return callback(unlinkErr)
                remaining -= 1
                if (remaining === 0) callback(null)
            })
        })
    })
}

// Cập nhật file ứng dụng
exports.updateApp = async (req, res) => {
    try {
        // Lấy phần mở rộng của file
        const ext = path.extname(req.file.originalname)
        const fileName = `techmo${ext}`
        const filePath = path.join(dataDir, fileName)
        
        // Xóa các file cũ với basename bắt đầu bằng "techmo"
        deleteOldFiles('techmo', async (err) => {
            if (err) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    message: 'Lỗi khi xóa file cũ!',
                    error: err.message
                })
            }

            
            // Sau khi xóa các file cũ, lưu file mới
            saveNewFile(req, res, filePath, settingService.updateApp)
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
        const filePath = path.join(dataDir, fileName)
        
        // Xóa các file cũ với basename bắt đầu bằng "instruction"
        deleteOldFiles('instruction', async (err) => {
            if (err) {
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                    message: 'Lỗi khi xóa file cũ!',
                    error: err.message
                })
            }
            
            // Sau khi xóa các file cũ, lưu file mới
            saveNewFile(req, res, filePath, settingService.updateInstruction)
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật file hướng dẫn!',
            error: e.message
        })
    }
}
