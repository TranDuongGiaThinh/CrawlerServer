const RenewalPackageModel = require('../models/renewal_package_model')
const Sequelize = require('sequelize')

// Kiểm tra gói có tồn tại (không bị xóa)
exports.checkExists = async (id) => {
    const renewalPackage = await RenewalPackageModel.findByPk(id)

    return renewalPackage ? !renewalPackage.deleted : false
}

// Lấy danh sách gói gia hạn
exports.getAll = async () => {
    const renewalPackages = await RenewalPackageModel.findAll({
        where: {
            deleted: false
        }
    })

    return renewalPackages
}

// Kiểm tra tên gói gia hạn đã tồn tại
exports.checkNameExists = async (name) => {
    const renewalPackage = await RenewalPackageModel.findOne({
        where: {
            type: name
        }
    })

    return renewalPackage ? !renewalPackage.deleted : false
}
exports.checkNameExistsWithId = async (id, name) => {
    const renewalPackage = await RenewalPackageModel.findOne({
        where: {
            id: {
                [Sequelize.Op.ne]: id
            },
            type: name
        }
    })

    return renewalPackage ? !renewalPackage.deleted : false
}

// Thêm gói gia hạn
exports.add = async (type, description, promotion, days) => {
    const newPackage = await RenewalPackageModel.create({
        type, description, promotion, days, deleted: false
    })

    return newPackage
}

// Cập nhật gói gia hạn
exports.update = async (id, type, description, promotion, days) => {
    const renewalPackage = await RenewalPackageModel.findByPk(id)

    renewalPackage.type = type
    renewalPackage.description = description
    renewalPackage.promotion = promotion
    renewalPackage.days = days

    await renewalPackage.save()

    return renewalPackage
}

// Xóa gói gia hạn
exports.delete = async (id) => {
    const renewalPackage = await RenewalPackageModel.findByPk(id)

    renewalPackage.deleted = true

    await renewalPackage.save()
}
