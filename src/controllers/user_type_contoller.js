const {HTTP_STATUS} =require('../untils/constants')
const userTypeService = require('../services/user_type_service')

// Lấy danh sách gói thành viên
exports.getAll = async (req, res) => {
    try {
        const userTypes = await userTypeService.getAll()

        res.status(HTTP_STATUS.OK).json({
            user_types: userTypes,
            message: 'Lấy danh sách gói thành viên thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            user_types: [],
            message: 'Lỗi khi lấy danh sách gói gia hạn!',
            error: e.message
        })
    }
}

// Kiểm tra tên gói thành viên đã tồn tại
exports.checkNameExists = async (req, res) => {
    try {
        const {id, name} = req.query

        // Kiểm tra đủ tham số đầu vào
        if (!name) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            });
        }

        if (id) {
            // Kiểm tra gói có tồn tại
            const checkExists = await userTypeService.checkExists(id)
            if (!checkExists) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: 'Gói thành viên không tồn tại!'
                });
            }
        }

        // Thực hiện kiểm tra
        const checkResult = id ? 
            await userTypeService.checkNameExistsWithId(id, name)
            : await userTypeService.checkNameExists(name) 

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra tên gói thành viên đã tồn tại thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra tên gói thành viên đã tồn tại!',
            error: e.message
        })
    }
}

// Thêm gói thành viên
exports.add = async (req, res) => {
    try {
        const {type, description, max_auto_config, max_config, max_export, price} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!type || !description || max_auto_config == null || max_config == null || max_export == null || price == null) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            });
        }

        // Kiểm tra tên gói đã tồn tại
        const exists = await userTypeService.checkNameExists(type)
        if (exists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên gói thành viên đã tồn tại!'
            });
        }

        // Thực hiện thêm
        const newUserType = await userTypeService.add(type, description, max_auto_config, max_config, max_export, price)

        res.status(HTTP_STATUS.OK).json({
            user_type: newUserType,
            message: 'Thêm gói thành viên thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thêm gói thành viên!',
            error: e.message
        })
    }
}

// Cập nhật gói thành viên
exports.update = async (req, res) => {
    try {
        const {id, type, description, max_auto_config, max_config, max_export, price} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!id || !type || !description || max_auto_config == null || max_config == null || max_export == null || price == null) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            });
        }

        // Kiểm tra gói thành viên có tồn tại
        const checkExists = await userTypeService.checkExists(id)
        if (!checkExists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Gói thành viên không tồn tại!'
            });
        }

        // Kiểm tra tên gói đã tồn tại
        const checkNameExists = await userTypeService.checkNameExistsWithId(id, type)
        if (checkNameExists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên gói thành viên đã tồn tại!'
            });
        }

        // Thực hiện cập nhật
        const updatedUserType = await userTypeService.update(id, type, description, max_auto_config, max_config, max_export, price)

        res.status(HTTP_STATUS.OK).json({
            user_type: updatedUserType,
            message: 'Cập nhật gói thành viên thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật gói thành viên!',
            error: e.message
        })
    }
}

// Xóa gói thành viên
exports.delete = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            });
        }

        // Kiểm tra gói có tồn tại
        const exists = await userTypeService.checkExists(id)
        if (!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Gói thành viên không tồn tại!'
            });
        }

        // Thực hiện xóa
        await userTypeService.delete(id)

        res.status(HTTP_STATUS.OK).json({
            message: 'Xóa gói thành viên thành công!'
        })
    } catch(e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa gói thành viên!',
            error: e.message
        })
    }
}
