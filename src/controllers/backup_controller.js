const {HTTP_STATUS} = require('../untils/constants')
const backupService = require('../services/backup_service')

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Lưu file backup
const saveFileBackup = async (content, fileName) => {
    const dir = path.join(__dirname, '../../backups')

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }

    const filePath = path.join(dir, fileName)
    fs.writeFileSync(filePath, content, 'utf8')
}

// Lưu file tạm thời
const saveTemporaryFile = async (file) => {
    const tempDir = path.join(__dirname, '../../temp')
    
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true })
    }

    const filePath = path.join(tempDir, file.filename)
    return filePath
}

// Hàm định dạng ngày giờ thành chuỗi YYYYMMDD_HHMMSS
const getFormattedDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${year}${month}${day}_${hours}${minutes}${seconds}`
}

// Lấy khóa bí mật từ biến môi trường
const algorithm = 'aes-256-cbc'
const key = process.env.SECRET_KEY

// Hàm mã hóa văn bản thành chuỗi hex
function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Hàm giải mã chuỗi hex thành văn bản ban đầu
function decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Tạo file backup trước khi khôi phục
const createBackupBeforeRestore = async () => {
    const data = await backupService.getAllData()
    const jsonData = JSON.stringify(data, null, 2)
    const encData = encrypt(jsonData)
    const fileName = `backup_before_restore_${getFormattedDate()}.enc`
    await saveFileBackup(encData, fileName)
}

// Tạo file backup hệ thống
exports.createBackup = async (req, res) => {
    try {
        const data = await backupService.getAllData()

        const jsonData = JSON.stringify(data, null, 2)
        const encData = encrypt(jsonData)
        await saveFileBackup(encData, `backup_${getFormattedDate()}.enc`)

        res.setHeader('Content-Disposition', `attachment; filename=backup.enc`)
        res.setHeader('Content-Type', 'application/octet-stream')

        res.status(HTTP_STATUS.CREATED).send(encData)
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
        // Lưu file backup tạm thời từ yêu cầu client
        const tempFilePath = await saveTemporaryFile(req.file)

        // Tạo bản sao lưu dữ liệu hiện tại trước khi khôi phục
        await createBackupBeforeRestore()

        let data
        try {
            // Đọc và giải mã dữ liệu từ file backup gửi lên
            const encryptedData = fs.readFileSync(tempFilePath, 'utf8');
            const decryptedData = decrypt(encryptedData);
            data = JSON.parse(decryptedData);

            // Khôi phục dữ liệu từ file backup
            await backupService.restore(data)

            // Xóa file backup tạm thời
            fs.unlinkSync(tempFilePath)
        } catch (decryptError) {
            // Xóa file backup tạm thời nếu giải mã thất bại
            fs.unlinkSync(tempFilePath);

            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'File backup không hợp lệ!',
                error: decryptError.message
            });
        }

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
