const {HTTP_STATUS} = require('../untils/constants')
const userService = require('../services/user_service')

// Đăng ký tài khoản người dùng
exports.register = async (req, res) => {
    try {
        const {username, password, fullname, email, phone} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!username || !password || !fullname || !email || !phone) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra username đã tồn tại
        const exists = await userService.checkUsernameExists(username)
        if (exists) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Tên đăng nhập đã tồn tại!'
            })
        }

        // Thực hiện thêm
        const newUser = await userService.add(username, password, fullname, email, phone)

        res.status(HTTP_STATUS.OK).json({
            user: newUser,
            message: 'Đăng ký tài khoản người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi đăng ký tài khoản người dùng!',
            error: e.message
        })
    }
}

// Kiểm tra tên đăng nhập đã tồn tại
exports.checkUsernameExists = async (req, res) => {
    try {
        const {username} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!username) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Thực hiện kiểm tra tên đăng nhập
        const exists = await userService.checkUsernameExists(username)

        res.status(HTTP_STATUS.OK).json({
            check_result: exists,
            message: 'Kiểm tra tên đăng nhập thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra tên đăng nhập!',
            error: e.message
        })
    }
}

// Kiểm tra đăng nhập
exports.checkLogin = async (req, res) => {
    try {
        const {username, password} = req.body

        // Kiểm tra đủ tham số đầu vào
        if (!username || !password) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }
        
        // Thực hiện đăng nhập
        const user = await userService.checkLogin(username, password)
        if (!user) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thông tin đăng nhập sai!'
            })
        }
        else {
            res.status(HTTP_STATUS.OK).json({
                user: user,
                message: 'Đăng nhập thành công!'
            })
        }
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi kiểm tra đăng nhập!',
            error: e.message
        })
    }
}

// Lấy thông tin tài khoản người dùng
exports.getUser = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(id)
        if(!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Thực hiện lấy thông tin của người dùng
        const user = await userService.getUser(id)

        res.status(HTTP_STATUS.OK).json({
            user: user,
            message: 'Lấy thông tin người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy thông tin người dùng!',
            error: e.message
        })
    }
}

// Lấy danh sách người dùng
exports.getAllUser = async (req, res) => {
    try {
        const users = await userService.getAllUser()

        res.status(HTTP_STATUS.OK).json({
            users: users,
            message: 'Lấy danh sách người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi lấy danh sách người dùng!',
            error: e.message
        })
    }
}

// Tìm kiếm người dùng bằng từ khóa
exports.searchUser = async (req, res) => {
    try {
        const {keyword} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!keyword) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Thực hiện tìm người dùng
        const user = await userService.search(keyword)

        if (!user) {
            return res.status(HTTP_STATUS.OK).json({
                user: user,
                message: 'Không tìm thấy người dùng!'
            })
        }
        else {
            res.status(HTTP_STATUS.OK).json({
                user: user,
                message: 'Tìm kiếm người dùng thành công!'
            })
        }
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi tìm kiếm người dùng!',
            error: e.message
        })
    }
}

// Khóa tài khoản người dùng
exports.lockUser = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(id)
        if(!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Thực hiện khóa người dùng
        await userService.lockUser(id)

        res.status(HTTP_STATUS.OK).json({
            message: 'Khóa người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi khóa người dùng!',
            error: e.message
        })
    }
}

// Mở khóa tài khoản người dùng
exports.unlockUser = async (req, res) => {
    try {
        const {id} = req.params

        // Kiểm tra đủ tham số đầu vào
        if (!id) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Thiếu tham số đầu vào!'
            })
        }

        // Kiểm tra người dùng có tồn tại
        const exists = await userService.checkUserExists(id)
        if(!exists) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                message: 'Người dùng không tồn tại!'
            })
        }

        // Thực hiện mở khóa người dùng
        await userService.unlockUser(id)

        res.status(HTTP_STATUS.OK).json({
            message: 'Mở khóa người dùng thành công!'
        })
    } catch (e) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: 'Lỗi khi mở khóa người dùng!',
            error: e.message
        })
    }
}
