const {HTTP_STATUS} = require('../untils/constants')
const packageUserService = require('../services/package_user_service')
const userService = require('../services/user_service')

// Lấy danh sách lịch sử đăng ký gói của người dùng
exports.getAllOfUser = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (id == null) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            });
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(id)

        if(!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        const packageUsers = await packageUserService.getAllOfUser(id)

        res.status(HTTP_STATUS.OK).json({
            package_users: packageUsers,
            message: 'Lấy lịch sử đăng ký gói thành viên của người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy lịch sử đăng ký gói thành viên của người dùng!',
            error: e.message
        })
    }
}

// Lấy gói đang được sử dụng của người dùng
exports.getPackageIsUsing = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (id == null) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            });
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(id)

        if(!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        const packageUser = await packageUserService.getPackageIsUsing(id)

        res.status(HTTP_STATUS.OK).json({
            package_user: packageUser,
            message: 'Lấy gói thành viên của người dùng đang sử dụng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy gói thành viên của người dùng đang sử dụng!',
            error: e.message
        })
    }
}

// Thêm thông tin đăng ký gói mới
exports.add = async (req, res) => {
    try {
        const {user_id, user_type, renewal_package, days, total_price, max_auto_config, max_config, max_export} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (user_id ==  null || user_type ==  null || renewal_package ==  null 
            || days ==  null || total_price ==  null || max_auto_config ==  null 
            || max_config ==  null || max_export ==  null) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: 'Thiếu tham số đầu vào!'
                });
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(user_id)
        if(!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        const newPackageUser = await packageUserService.add(
            user_id, user_type, renewal_package, days, total_price, max_auto_config, max_config, max_export
        )

        res.status(HTTP_STATUS.CREATED).json({
            package_user: newPackageUser,
            message: 'Thêm lịch sử đăng ký gói thành viên của người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi thêm lịch sử đăng ký gói thành viên của người dùng!',
            error: e.message
        })
    }
}
