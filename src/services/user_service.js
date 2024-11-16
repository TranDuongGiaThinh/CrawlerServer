const UserModel = require('../models/user_model')
const AccountTypeModel = require('../models/account_type_model')
const Sequelize = require('sequelize')

// Kiểm tra người dùng có tồn tại
exports.checkUserExists = async (userId) => {
    const adminAccountType = await AccountTypeModel.findOne({
        where: {
            is_admin: true
        }
    })

    const user = await UserModel.findOne({
        where: {
            id: userId,
            account_type_id: {
                [Sequelize.Op.ne]: adminAccountType.id
            }
        }
    })

    return user ? true : false
}

// Đăng ký tài khoản người dùng
exports.add = async (username, password, fullname, email, phone) => {
    const userAccountType = await AccountTypeModel.findOne({
        where: {
            is_admin: false
        }
    })

    const newUser = await UserModel.create({
        account_type_id: userAccountType.id,
        username,
        password,
        fullname,
        email,
        phone,
        config_count: 0,
        export_count: 0,
        locked: false
    })

    return newUser
}

// Kiểm tra tên đăng nhập đã tồn tại
exports.checkUsernameExists = async (username) => {
    const user = await UserModel.findOne({
        where: {
            username: username
        }
    })

    return user ? true : false
}

// Kiểm tra đăng nhập
exports.checkLogin = async (username, password) => {
    const user = await UserModel.findOne({
        where: {
            username: username,
            password: password
        }
    })

    return user
}

// Lấy thông tin tài khoản người dùng
exports.getUser = async (userId) => {
    const user = await UserModel.findOne({
        where: {
            id: userId
        }
    })

    return user
}

// Lấy danh sách người dùng
exports.getAllUser = async () => {
    const adminAccountType = await AccountTypeModel.findOne({
        where: {
            is_admin: true
        }
    })

    const users = await UserModel.findAll({
        where: {
            account_type_id: {
                [Sequelize.Op.ne]: adminAccountType.id
            }
        }
    })

    return users
}

// Tìm kiếm người dùng bằng từ khóa
exports.search = async (key) => {
    const adminAccountType = await AccountTypeModel.findOne({
        where: {
            is_admin: true
        }
    })

    const users = await UserModel.findAll({
        where: {
            [Sequelize.Op.and]: [
                Sequelize.literal(`LOWER(username) LIKE LOWER('${key}%')`),
                {
                    account_type_id: {
                        [Sequelize.Op.ne]: adminAccountType.id
                    }
                }
            ]
        }
    })

    return users
}

// Khóa tài khoản người dùng
exports.lockUser = async (userId) => {
    const user = await UserModel.findByPk(userId)

    user.locked = true

    await user.save()
}

// Mở khóa tài khoản người dùng
exports.unlockUser = async (userId) => {
    const user = await UserModel.findByPk(userId)

    user.locked = false

    await user.save()
}

// Tăng số lần xuất file của người dùng
exports.increaseExportCount = async (userId) => {
    const user = await UserModel.findByPk(userId)

    user.export_count ++
    user.save()
}

// reset quyền
exports.resetPermission = async (userId) => {
    const user = await UserModel.findByPk(userId)

    user.config_count = 0
    user.export_count = 0

    await user.save()
}
