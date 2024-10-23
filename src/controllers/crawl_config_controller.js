const {HTTP_STATUS} = require('../untils/constants')
const crawlConfigService = require('../services/crawl_config_service')
const userService = require('../services/user_service')

// Lấy danh sách cấu hình của người dùng
exports.getAllConfigOfUser = async (req, res) => {
    try {
        const {user_id} = req.params
        
        // Kiểm tra người dùng có tồn tại
        const checkResult = await userService.checkUserExists(user_id)
        if (!checkResult) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Thực hiện lấy danh sách cấu hình của người dùng
        const configs = await crawlConfigService.getAllOfUser(user_id)
        
        res.status(HTTP_STATUS.OK).json({
            message: 'Lấy danh sách cấu hình của người dùng thành công!',
            configs: configs
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thực hiện lấy danh sách cấu hình của người dùng!',
            error: error.message
        })
    }
}

// Kiểm tra quyền tạo mới cấu hình của người dùng
exports.checkPermission = async (req, res) => {
    try {
        const {user_id} = req.params

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(user_id)
        if (!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Thực hiện kiểm tra quyền tạo mới cấu hình
        const permission = await crawlConfigService.checkPermission(user_id)
        
        res.status(HTTP_STATUS.OK).json({
            check_result: permission,
            message: 'Kiểm tra quyền tạo mới cấu hình của người dùng thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thực hiện kiểm tra quyền tạo mới cấu hình của người dùng!',
            error: error
        })
    }
}

// Kiểm tra tên cấu hình đã tồn tại
exports.checkNameExists = async (req, res) => {
    try {
        const {user_id, name} = req.query

        // Kiểm tra đủ tham số đầu vào
        if (!user_id || !name) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(user_id)
        if (!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Thực hiện kiểm tra tên cấu hình
        const checkResult = await crawlConfigService.checkNameExists(user_id, name)
        
        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra tên cấu hình đã tồn tại thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thực hiện kiểm tra tên cấu hình đã tồn tại!',
            error: error
        })
    }
}

// Kiểm tra trạng thái hoàn thành của cấu hình
exports.checkIsComplete = async (req, res) => {
    try {
        const {config_id} = req.params

        // Kiểm tra cấu hình có tồn tại
        const exists = await crawlConfigService.checkExists(config_id)
        if (!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Cấu hình không tồn tại!'
            })
        }

        // Thực hiện kiểm tra cấu hình đã hoàn thành
        const checkResult = await crawlConfigService.checkIsComplete(config_id)
        
        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra trạng thái hoàn thành của cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thực hiện kiểm tra trạng thái hoàn thành của cấu hình!',
            error: error
        })
    }
}

// Tạo mới cấu hình
exports.add = async (req, res) => {
    try {
        const { user_id, name, description, url, website_id, crawl_type_id } = req.body

        // Kiểm tra tham số đầu vào
        if (!user_id || !name || !description || !url || !website_id || !crawl_type_id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra người dùng có tồn tại
        const checkResult = await userService.checkUserExists(user_id)
        if (!checkResult) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Kiểm tra quyền tạo mới cấu hình của người dùng
        const checkPermission = await crawlConfigService.checkPermission(user_id)
        if (!checkPermission) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Người dùng không có quyền tạo mới cấu hình!'
            })
        }

        // Kiểm tra tên cấu hình đã tồn tại
        const checkName = await crawlConfigService.checkNameExists(user_id, name)
        if (checkName) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Tên cấu hình đã tồn tại!'
            })
        }

        // Thực hiện thêm
        const newConfig = await crawlConfigService.add(user_id, name, description, url, website_id, crawl_type_id)
        
        res.status(HTTP_STATUS.CREATED).json({
            config: newConfig,
            message: 'Tạo cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thực hiện tạo cấu hình!',
            error: error
        })
    }
}

// Cập nhật cấu hình
exports.update = async (req, res) => {
    try {
        const { id, result_type_id, item_type_id, http_method_id, item_selector, headers_api, body_api } = req.body

        // Kiểm tra tham số đầu vào
        if (!id || !result_type_id || !item_type_id || !http_method_id || !item_selector || !headers_api || !body_api) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra trạng thái của cấu hình
        const checkIsComplete = await crawlConfigService.checkIsComplete(id)
        if (checkIsComplete) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                message: 'Không thể chỉnh sửa cấu hình đã hoàn thành!'
            })
        }

        // Thực hiện cập nhật
        const configUpdated = await crawlConfigService.update(
            id, result_type_id, item_type_id, http_method_id, item_selector, headers_api, body_api
        )
        
        res.status(HTTP_STATUS.OK).json({
            config: configUpdated,
            message: 'Cập nhật cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thực hiện cập nhật cấu hình!',
            error: error
        })
    }
}

// Cập nhật trạng thái hoàn thành của cấu hình
exports.complete = async (req, res) => {
    try {
        const { config_id } = req.params

        // Kiểm tra cấu hình có tồn tại
        const exists = await crawlConfigService.checkExists(config_id)
        if (!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Cấu hình không tồn tại!'
            })
        }

        // Thực hiện đánh dấu cấu hình đã hoàn thành
        await crawlConfigService.complete(config_id)
        
        res.status(HTTP_STATUS.OK).json({
            message: 'Cập nhật trạng thái hoàn thành của cấu hình là đã hoàn thành thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thực hiện cập nhật trạng thái hoàn thành của cấu hình!',
            error: error
        })
    }
}
