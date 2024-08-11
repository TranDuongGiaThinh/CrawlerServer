const {HTTP_STATUS} = require('../untils/constants')
const accountTypeService = require('../services/account_type_service')

// Kiểm tra quyền quản trị của loại tài khoản
exports.checkAdminPermission = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra loại tài khoản có tồn tại
        const exists = await accountTypeService.checkExists(id)

        if(!exists) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                is_admin: false,
                message: 'Loại tài khoản không tồn tại'
            })

            return
        }

        // Kiểm tra quyền của tài khoản
        const checkResult = await accountTypeService.checkAdminPermission(id)

        res.status(HTTP_STATUS.OK).json({
            is_admin: checkResult,
            message: 'Kiểm tra quyền quản trị thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            is_admin: false,
            message: 'Lỗi khi khiểm tra quyền của loại tài khoản!',
            error: e.message
        })
    }
}
