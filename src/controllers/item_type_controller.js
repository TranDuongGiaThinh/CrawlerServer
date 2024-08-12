const {HTTP_STATUS} = require('../untils/constants')
const itemTypeService = require('../services/item_type_service')
const userService = require('../services/user_service')

// Lấy danh sách chủ đề thu thập mà người dùng đã tạo
exports.getAllItemTypeOfUser = async (req, res) => {
    try {
        const {user_id} = req.params

        // Kiểm tra người dùng tồn tại
        const exists = await userService.checkUserExists(user_id)

        if(!exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                item_types: [],
                message: 'Người dùng không tồn tại'
            })

            return
        }

        // Lấy danh sách
        const itemTypes = await itemTypeService.getAllItemTypeOfUser(user_id)

        res.status(HTTP_STATUS.OK).json({
            item_types: itemTypes,
            message: 'Lấy danh sách chủ đề thu thập của người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            crawl_data_types: [],
            message: 'Lỗi khi lấy danh sách chủ đề thu thập của người dùng!',
            error: e.message
        })
    }
}

// Kiểm tra tên chủ đề thu thập đã tồn tại
exports.checkNameExists = async (req, res) => {
    try {
        const {name, user_id} = req.params

        // Kiểm tra người dùng tồn tại
        const exists = await userService.checkUserExists(user_id)

        if(!exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Người dùng không tồn tại!'
            })

            return
        }

        // Kiểm tra tên
        const checkResult = await itemTypeService.checkNameExists(name, user_id)

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra tên chủ đề thu thập của người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra tên chủ đề thu thập của người dùng!',
            error: e.message
        })
    }
}

// Kiểm tra chủ đề có đang được sử dụng
exports.checkItemTypeIsUsing = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra chủ đề có tồn tại
        const exists = await itemTypeService.checkExists(id)

        if(!exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Chủ đề thu thập không tồn tại!'
            })

            return
        }

        // Kiểm tra chủ đề có đang được sử dụng
        const checkResult = await itemTypeService.checkItemTypeIsUsing(id)

        res.status(HTTP_STATUS.OK).json({
            check_result: checkResult,
            message: 'Kiểm tra tên chủ đề thu thập có đang được sử dụng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra tên chủ đề thu thập có đang được sử dụng!',
            error: e.message
        })
    }
}

// Thêm chủ đề thu thập mới
exports.add = async (req, res) => {
    try {
        const {user_id, type, description} = req.body

        // Kiểm tra tên chủ đề đã tồn tại
        const nameExists = await itemTypeService.checkNameExists(type, user_id)

        if(nameExists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên chủ đề đã tồn tại!'
            })

            return
        }

        // Kiểm tra người dùng tồn tại
        const userExists = await userService.checkUserExists(user_id)

        if(!userExists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Người dùng không tồn tại!'
            })

            return
        }

        // Thực hiện thêm
        const newItemType = await itemTypeService.add(type, description, user_id)

        res.status(HTTP_STATUS.OK).json({
            item_type: newItemType,
            message: 'Thêm chủ đề thu thập thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thêm chủ đề thu thập!',
            error: e.message
        })
    }
}

// Chỉnh sửa chủ đề thu thập
exports.update = async (req, res) => {
    try {
        const {id, type, description} = req.body

        // Kiểm tra tên chủ đề có trùng với các chủ đề khác
        const exists = await itemTypeService.checkNameExistsWithId(id, type)
        
        if(exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên chủ đề bị trùng với chủ đề khác!'
            })

            return
        }

        // Thực hiện xóa
        const updatedItemType = await itemTypeService.update(id, type, description)

        res.status(HTTP_STATUS.OK).json({
            item_type: updatedItemType,
            message: 'Cập nhật chủ đề thu thập thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi cập nhật chủ đề thu thập!',
            error: e.message
        })
    }
}

// Xóa chủ đề thu thập
exports.delete = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra chủ đề có đang dược sử dụng
        const exists = await itemTypeService.checkItemTypeIsUsing(id)
        
        if(exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Chủ đề đang được sử dụng, không thể xóa!'
            })

            return
        }

        // Thực hiện xóa
        await itemTypeService.delete(id)

        res.status(HTTP_STATUS.OK).json({
            message: 'Xóa chủ đề thu thập thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi xóa chủ đề thu thập!',
            error: e.message
        })
    }
}
