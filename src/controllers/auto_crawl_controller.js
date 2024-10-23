const {HTTP_STATUS} = require('../untils/constants')
const autoCrawlService = require('../services/auto_crawl_service')

// Kiểm tra cấu hình thu thập tự động đã tồn tại
exports.checkAutoCrawlExists = async (req, res) => {
    try {
        const {config_id} = req.params

        const checkResult = await autoCrawlService.checkAutoCrawlExistsByConfigId(config_id)
        
        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult, 
            message: 'Kiểm tra cấu hình thu thập tự động đã tồn tại thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            message: 'Lỗi khi kiểm tra cấu hình thu thập tự động đã tồn tại!',
            error: error.message
        })
    }
}

// Kiểm tra quyền tạo cấu hình thu thập tự động
exports.checkPermission = async (req, res) => {
    try {
        const {user_id} = req.params

        const checkResult = await autoCrawlService.checkPermission(user_id)

        res.status(HTTP_STATUS.OK).json({ 
            check_result: checkResult,
            message: 'Kiểm tra quyền tạo cấu hình thu thập tự động thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            message: 'Lỗi khi kiểm tra quyền tạo cấu hình thu thập tự động!',
            error: error.message
        })
    }
}

// Tạo cấu hình thu thập tự động
exports.add = async (req, res) => {
    try {
        const {user_id, crawl_config_id, crawl_time} = req.body

        // Kiểm tra đủ tham số đầu vào
        if(!user_id || !crawl_config_id || !crawl_time) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra quyền tạo
        const checkPermission = await autoCrawlService.checkPermission(user_id)
        if(!checkPermission) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({ 
                message: 'Người dùng không có quyền tạo thêm cấu hình thu thập tự động!'
            })
        }

        // Kiểm tra cấu hình thu thập tự động đã tồn tại
        const checkexists = await autoCrawlService.checkAutoCrawlExistsByConfigId(crawl_config_id)
        if(checkexists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ 
                message: 'Cấu hình này đã được đặt tự động thu thập!'
            })
        }

        // Thực hiện thêm
        const newAutoCrawl = await autoCrawlService.add(user_id, crawl_config_id, crawl_time)
        
        res.status(HTTP_STATUS.CREATED).json({ 
            auto_crawl: newAutoCrawl,
            message: 'Tạo cấu hình thu thập tự động thành công!'
        })
    } catch (error) {
        console.log(error)
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            message: 'Lỗi khi tạo cấu hình thu thập tự động!',
            error: error.message
        })
    }
}

// Xóa cấu hình thu thập tự động
exports.delete = async (req, res) => {
    try {
        const {config_id} = req.params

        const checkExists = await autoCrawlService.checkAutoCrawlExistsByConfigId(config_id)
        if(!checkExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ 
                message: 'Không tìm thấy cấu hình này trong danh sách cấu hình tự động thu thập!'
            })
        }

        await autoCrawlService.delete(config_id)
        
        res.status(HTTP_STATUS.OK).json({ 
            message: 'Xóa cấu hình thu thập tự động thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            message: 'Lỗi khi xóa cấu hình thu thập tự động!',
            error: error.message
        })
    }
}
