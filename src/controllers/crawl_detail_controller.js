const {HTTP_STATUS} = require('../untils/constants')
const crawlDetailService = require('../services/crawl_detail_service')
const crawConfigService = require('../services/crawl_config_service')

// Thêm chi tiết cấu hình
exports.add = async (req, res) => {
    try {
        const { 
            crawl_config_id, sort_index, data_type_id, name, selector, attribute, is_primary_key, is_detail_url, is_contain_keywords
        } = req.body
        
        // Kiểm tra đủ tham số đầu vào
        if (!crawl_config_id || !sort_index  || !data_type_id 
            || !name || !selector || !is_primary_key == null
            || is_detail_url == null || !is_contain_keywords == null) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: 'Thiếu tham số đầu vào!'
                });
        }

        // Kiểm tra cấu hình có tồn tại
        const checkConfigExists = await crawConfigService.checkExists(crawl_config_id)
        if (!checkConfigExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Cấu hình không tồn tại!'
            })
        }

        // Kiểm tra tên chi tiết cấu hình
        const checkNameExists = await crawlDetailService.checkNameExists(crawl_config_id, name)
        if (checkNameExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Tên chi tiết cấu hình đã tồn tại!'
            })
        }

        // Kiểm tra thứ tự chi tiết cấu hình
        const checkSortIndexExists = await crawlDetailService.checkSortIndexExists(crawl_config_id, sort_index)
        if (checkSortIndexExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Thứ tự sắp xếp chi tiết cấu hình đã tồn tại!'
            })
        }

        // Thực hiện thêm mới
        const newDetail = await crawlDetailService.add(
            crawl_config_id, sort_index, data_type_id, name, selector, attribute, is_primary_key, is_detail_url, is_contain_keywords
        )
        
        res.status(HTTP_STATUS.OK).json({
            crawl_detail: newDetail,
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
        const { 
            crawl_detail_id, crawl_config_id, 
            sort_index, data_type_id, name, 
            selector, attribute, is_primary_key, 
            is_detail_url, is_contain_keywords
        } = req.body
        
        // Kiểm tra đủ tham số đầu vào
        if (!crawl_detail_id || !crawl_config_id || !sort_index  || !data_type_id 
            || !name || !selector || !is_primary_key == null
            || is_detail_url == null || !is_contain_keywords == null) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: 'Thiếu tham số đầu vào!'
                });
        }

        // Kiểm tra chi tiết cấu hình có tồn tại
        const checkDetailExists = await crawlDetailService.checkExists(crawl_detail_id)
        if (!checkDetailExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Chi tiết cấu hình không tồn tại!'
            })
        }

        // Kiểm tra tên chi tiết cấu hình
        const checkNameExists = await crawlDetailService.checkNameExistsWithId(crawl_detail_id, crawl_config_id, name)
        if (checkNameExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Tên chi tiết cấu hình đã tồn tại!'
            })
        }

        // Kiểm tra thứ tự chi tiết cấu hình
        const checkSortIndexExists = await crawlDetailService.checkSortIndexExistsWithId(crawl_detail_id, crawl_config_id, sort_index)
        if (checkSortIndexExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Thứ tự sắp xếp chi tiết cấu hình đã tồn tại!'
            })
        }

        // Thực hiện cập nhật
        const updatedDetail = await crawlDetailService.update(
            crawl_detail_id, sort_index, data_type_id, name, selector, attribute, is_primary_key, is_detail_url, is_contain_keywords
        )

        res.status(HTTP_STATUS.OK).json({
            crawl_detail: updatedDetail,
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
        const {id} = req.params

        // Kiểm tra chi tiết cấu hình có tồn tại
        const checkDetailExists = await crawlDetailService.checkExists(id)
        if (!checkDetailExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Chi tiết cấu hình không tồn tại!'
            })
        }

        // Thực hiện xóa
        await crawlDetailService.delete(id)

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
exports.getAllOfConfig = async (req, res) => {
    try {
        const {config_id} = req.params

        // Kiểm tra cấu hình có tồn tại
        const checkConfigExists = await crawConfigService.checkExists(config_id)
        if (!checkConfigExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Cấu hình không tồn tại!'
            })
        }

        // Lấy danh sách chi tiết cấu hình
        const details = await crawlDetailService.getAllOfConfig(config_id)
        
        res.status(HTTP_STATUS.OK).json({
            crawl_details: details,
            message: 'Lấy danh sách chi tiết cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách chi tiết cấu hình!',
            error: error.message
        })
    }
}

// Kiểm tra tên chi tiết cấu hình của một cấu hình
exports.checkNameExists = async (req, res) => {
    try {
        const {crawl_detail_id, config_id, name} = req.query

        let checkResult;
        if (crawl_detail_id) {
            checkResult = await crawlDetailService.checkNameExistsWithId(crawl_detail_id, config_id, name)
        }
        else {
            checkResult = await crawlDetailService.checkNameExists(config_id, name)
        }
        
        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra tên chi tiết cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra tên chi tiết cấu hình!',
            error: error.message
        })
    }
}

// Kiểm tra thứ tự thực hiện chi tiết cấu hình của một cấu hình đã tồn tại
exports.checkSortIndexExists = async (req, res) => {
    try {
        const {index, config_id} = req.query

        const checkResult = await crawlDetailService.checkSortIndexExists(config_id, index)
        
        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra thứ tự thực hiện chi tiết cấu hình thành công!'
        })
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra thứ tự thực hiện chi tiết cấu hình!',
            error: error.message
        })
    }
}
