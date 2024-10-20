const {HTTP_STATUS} = require('../untils/constants')
const crawlActionDetailService = require('../services/crawl_action_detail_service')
const crawlConfigService = require('../services/crawl_config_service')

// Thêm chi tiết hành động
exports.add = async (req, res) => {
    try {
        const { crawl_config_id, sort_index, action_type_id, selector, value, is_list } = req.body
        
        // Kiểm tra đủ tham số đầu vào
        if (!crawl_config_id || !sort_index || !action_type_id || !selector || !value || is_list == null) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: 'Thiếu tham số đầu vào!'
                });
        }

        // Kiểm tra cấu hình có tồn tại
        const checkConfigExists = await crawlConfigService.checkExists(crawl_config_id)
        if (!checkConfigExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Cấu hình không tồn tại!'
            })
        }

        // Kiểm tra thứ tự chi tiết hành động
        const checkSortIndexExists = await crawlActionDetailService.checkSortIndexExists(crawl_config_id, sort_index)
        if (checkSortIndexExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Thứ tự sắp xếp chi tiết hành động đã tồn tại!'
            })
        }

        // Thực hiện thêm mới
        const newActionDetail = await crawlActionDetailService.add(crawl_config_id, sort_index, action_type_id, selector, value, is_list)
        
        res.status(HTTP_STATUS.CREATED).json({
            crawl_action_detail: newActionDetail,
            message: 'Thêm mới chi tiết hành động thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thêm mới chi tiết hành động!',
            error: error.message
        })
    }
}

// Chỉnh sửa chi tiết hành động
exports.update = async (req, res) => {
    try {
        const { id, crawl_config_id, sort_index, action_type_id, selector, value, is_list } = req.body
        
        // Kiểm tra đủ tham số đầu vào
        if (!id || !sort_index || !action_type_id || !selector || !value || is_list == null) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: 'Thiếu tham số đầu vào!'
                });
        }

        // Kiểm tra chi tiết hành động có tồn tại
        const checkDetailExists = await crawlActionDetailService.checkExists(id)
        if (!checkDetailExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Chi tiết hành động không tồn tại!'
            })
        }

        // Kiểm tra thứ tự chi tiết hành động
        const checkSortIndexExists = await crawlActionDetailService.checkSortIndexExistsWithId(id, crawl_config_id, sort_index)
        if (checkSortIndexExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Thứ tự sắp xếp chi tiết hành động đã tồn tại!'
            })
        }

        // Thực hiện cập nhật
        const updatedActionDetail = await crawlActionDetailService.update(id, sort_index, action_type_id, selector, value, is_list)

        res.status(HTTP_STATUS.OK).json({
            crawl_action_detail: updatedActionDetail,
            message: 'Cập nhật chi tiết hành động thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật chi tiết hành động!',
            error: error.message
        })
    }
}

// Xóa chi tiết hành động
exports.delete = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra chi tiết hành động có tồn tại
        const checkDetailExists = await crawlActionDetailService.checkExists(id)
        if (!checkDetailExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Chi tiết hành động không tồn tại!'
            })
        }

        // Thực hiện xóa
        await crawlActionDetailService.delete(id)

        res.status(HTTP_STATUS.OK).json({
            message: 'Xóa chi tiết hành động thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa chi tiết hành động!',
            error: error.message
        })
    }
}

// Lấy danh sách chi tiết hành động của một cấu hình
exports.getAllOfConfig = async (req, res) => {
    try {
        const {config_id} = req.params

        // Kiểm tra cấu hình có tồn tại
        const checkConfigExists = await crawlConfigService.checkExists(config_id)
        if (!checkConfigExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Cấu hình không tồn tại!'
            })
        }

        // Lấy danh sách chi tiết hành động
        const actionDetails = await crawlActionDetailService.getAllOfConfig(config_id)
        
        res.status(HTTP_STATUS.OK).json({
            crawl_action_details: actionDetails,
            message: 'Lấy danh sách chi tiết hành động thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách chi tiết hành động!',
            error: error.message
        })
    }
}

// Kiểm tra thứ tự thực hiện chi tiết hành động của một cấu hình đã tồn tại
exports.checkSortIndexExists = async (req, res) => {
    try {
        const {index, config_id} = req.query

        const checkResult = await crawlActionDetailService.checkSortIndexExists(config_id, index)
        
        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra thứ tự thực hiện hành động thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra thứ tự thực hiện hành động!',
            error: error.message
        })
    }
}
