const {HTTP_STATUS} = require('../untils/constants')
const itemService = require('../services/item_service')
const searchSuggestions = require('../services/search_suggestions')
const crawlConfigService = require('../services/crawl_config_service')
const itemDetailService = require('../services/item_detail_service')
const packageUserService = require('../services/package_user_service')
const userService = require('../services/user_service')

// Lấy danh sách dữ liệu mà người dùng đã thu thập
exports.getAllItemOfUser = async (req, res) => {
    try {
        const {user_id} = req.params

        // Lấy danh sách cấu hình của người dùng
        const configs = await crawlConfigService.getAllOfUser(user_id)

        // Lấy danh sách dữ liệu thu thập được của từng cấu hình
        const items = []
        for (const config of configs) {
            const itemOfConfigs = await itemService.getAllItemOfConfig(config.id)

            // Lấy chi tiết từng thuộc tính của item
            for (const item of itemOfConfigs) {
                const itemDetails = await itemDetailService.getAllItemDetailOfItem(item.id)

                items.push({item: item, item_details: itemDetails})
            }
        }
        
        res.status(HTTP_STATUS.OK).json({
            items: items,
            message: 'Lấy danh sách dữ liệu mà người dùng đã thu thập thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách dữ liệu mà người dùng đã thu thập!',
            error: error.message
        })
    }
}

// Lọc dữ liệu
exports.filter = async (req, res) => {
    try {
        // Lấy tham số từ query
        const { type_id, website_id, config_id } = req.query

        // Chuyển đổi các tham số thành số nguyên hoặc để null nếu không có
        const typeId = type_id ? parseInt(type_id, 10) : null
        const websiteId = website_id ? parseInt(website_id, 10) : null
        const configId = config_id ? parseInt(config_id, 10) : null
        
        // Lọc
        const filteredItems = await itemService.filter({ typeId, websiteId, configId })

        // Lấy chi tiết từng thuộc tính của item
        const items = []
        for (const item of filteredItems) {
            const itemDetails = await itemDetailService.getAllItemDetailOfItem(item.id)

            items.push({item: item, item_details: itemDetails})
        }
        
        res.status(HTTP_STATUS.OK).json({
            items: items,
            message: 'Lọc dữ liệu thu thập thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lọc dữ liệu thu thập!',
            error: error.message
        })
    }
}

// Kiểm tra quyền xuất dữ liệu
exports.checkExportPermission = async (req, res) => {
    try {
        const {user_id} = req.params

        // Kiểm tra người dùng tồn tại
        const exists = await userService.checkUserExists(user_id)
        if(!exists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Kiểm tra quyền
        const checkResult = await packageUserService.checkExportPermission(user_id)

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra quyền xuất dữ liệu thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra quyền xuất dữ liệu!',
            error: error.message
        })
    }
}

// Xuất dữ liệu
exports.export = async (req, res) => {
    try {
        // Lấy tham số từ query
        const { type_id, website_id, config_id } = req.query
        // const {user_id} = req.body

        // // Kiểm tra tham số user_id 
        // if (!user_id) {
        //     return res.status(HTTP_STATUS.BAD_REQUEST).json({
        //         message: 'Thiếu tham số đầu vào!'
        //     })
        // }

        // // Kiểm tra người dùng tồn tại
        // const exists = await userService.checkUserExists(user_id)
        // if(!exists) {
        //     return res.status(HTTP_STATUS.BAD_REQUEST).json({
        //         message: 'Người dùng không tồn tại!'
        //     })
        // }

        // Kiểm tra quyền
        // const permission = await packageUserService.checkExportPermission(user_id)
        // if(!permission) {
        //     return res.status(HTTP_STATUS.FORBIDDEN).json({
        //         message: 'Người dùng không có quyền xuất dữ liệu!'
        //     })
        // }

        // Chuyển đổi các tham số thành số nguyên hoặc để null nếu không có
        const typeId = type_id ? parseInt(type_id, 10) : null
        const websiteId = website_id ? parseInt(website_id, 10) : null
        const configId = config_id ? parseInt(config_id, 10) : null
        
        // Lọc
        const filteredItems = await itemService.filter({ typeId, websiteId, configId })

        // Lấy chi tiết từng thuộc tính của item
        const items = []
        for (const item of filteredItems) {
            const itemDetails = await itemDetailService.getAllItemDetailOfItem(item.id)

            items.push({item: item, item_details: itemDetails})
        }

        // lấy tên loại, lọc các thuộc tính cần thiết
        
        // Đặt tiêu đề file và trả file về client
        res.setHeader('Content-Disposition', `attachment; filename="data.json"`)
        res.setHeader('Content-Type', 'application/octet-stream')

        res.status(HTTP_STATUS.OK).send({data: items})
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xuất dữ liệu thu thập!',
            error: error.message
        })
    }
}

// Lấy danh sách từ khóa gợi ý tìm kiếm
exports.getSearchSuggestions = async (req, res) => {
    try {
        
        res.status(HTTP_STATUS.OK).json({
            items: [],
            message: 'Lấy danh sách từ khóa gợi ý tìm kiếm thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách từ khóa gợi ý tìm kiếm!',
            error: error.message
        })
    }
}

// Tìm kiếm dữ liệu thu thập bằng từ khóa
exports.search = async (req, res) => {
    try {
        
        res.status(HTTP_STATUS.OK).json({
            items: [],
            message: 'Tìm kiếm dữ liệu thu thập bằng từ khóa thành công!',
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tìm kiếm dữ liệu thu thập bằng từ khóa!',
            error: error.message
        })
    }
}
