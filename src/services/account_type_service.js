const AccountTypeModel = require('../models/account_type_model')

// Kiểm tra quyền quản trị của loại tài khoản
exports.checkAdminPermission = async (id) => {
    const accountType = await AccountTypeModel.findByPk(id)

    if(accountType) return accountType.is_admin

    return false;
}

// Kiểm tra loại tài khoản có tồn tại
exports.checkExists = async (id) => {
    const accountType = await AccountTypeModel.findByPk(id)

    if(accountType) return true

    return false;
}
