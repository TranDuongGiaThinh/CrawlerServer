const UserTypeModel = require('../models/user_type_model')
const Sequelize = require('sequelize')

// Kiểm tra gói có tồn tại (không bị xóa)
exports.checkExists = async (id) => {
    const userType = await UserTypeModel.findByPk(id)

    return userType ? !userType.deleted : false
}

// Lấy danh sách gói thành viên
exports.getAll = async () => {
    const userTypes = await UserTypeModel.findAll({
        where: {
            deleted: false
        }
    })

    return userTypes
}

// Kiểm tra tên gói thành viên đã tồn tại
exports.checkNameExists = async (name) => {
    const userType = await UserTypeModel.findOne({
        where: {
            type: name
        }
    })

    return userType ? !userType.deleted : false
}
exports.checkNameExistsWithId = async (id, name) => {
    const userType = await UserTypeModel.findOne({
        where: {
            id: {
                [Sequelize.Op.ne]: id
            },
            type: name
        }
    })

    return userType ? !userType.deleted : false
}

// Thêm gói thành viên
exports.add = async (type, description, maxAutoConfig, maxConfig, maxExport, price) => {
    const newUserType = await UserTypeModel.create({ 
        type,
        description,
        max_auto_config: maxAutoConfig,
        max_config: maxConfig,
        max_export: maxExport,
        price,
        deleted: false
    })

    return newUserType
}

// Cập nhật gói thành viên
exports.update = async (id, type, description, maxAutoConfig, maxConfig, maxExport, price) => {
    const userType = await UserTypeModel.findByPk(id)

    userType.type = type
    userType.description = description
    userType.max_auto_config = maxAutoConfig
    userType.max_config = maxConfig
    userType.max_export = maxExport
    userType.price = price

    await userType.save()

    return userType
}

// Xóa gói thành viên
exports.delete = async (id) => {
    const userType = await UserTypeModel.findByPk(id)

    userType.deleted = true

    await userType.save()
}
