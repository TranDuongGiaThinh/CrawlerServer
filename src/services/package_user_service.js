const PackageUserModel = require('../models/package_user_model')
const UserModel = require('../models/user_model')

// Lấy danh sách lịch sử đăng ký gói của người dùng
exports.getAllOfUser = async (userId) => {
    const packageUsers = await PackageUserModel.findAll({
        where: {
            user_id: userId
        }
    })

    return packageUsers
}

// Lấy gói đang được sử dụng của người dùng
exports.getPackageIsUsing = async (userId) => {
    const packageUser = await PackageUserModel.findOne({
        where: {
            user_id: userId,
            is_active: true
        }
    })

    return packageUser
}

// Thêm thông tin đăng ký gói mới
exports.add = async (userId, userType, renewalPackage, days, totalPrice, maxAutoConfig, maxConfig, maxExport) => {
    // Hủy gói đang sử dụng
    const packageUserIsUsing = await this.getPackageIsUsing(userId)
    if (packageUserIsUsing) {
        packageUserIsUsing.is_active = false;
        await packageUserIsUsing.save();
    }
    
    // Thực hiện thêm
    const newPackageUser = await PackageUserModel.create({
        user_id: userId,
        user_type: userType,
        renewal_package: renewalPackage,
        days: days,
        total_price: totalPrice,
        max_auto_config: maxAutoConfig,
        max_config: maxConfig,
        max_export: maxExport,
        is_active: true,
        create_at: Date.now()
    })

    // Làm mới lại thông tin sử dụng trong tháng của người dùng
    const user = await UserModel.findByPk(userId)

    user.config_count = 0
    user.export_count = 0
    await user.save()

    return newPackageUser
}
