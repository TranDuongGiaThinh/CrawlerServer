const UserModel = require('../models/user_model')
const AccountTypeModel = require('../models/account_type_model')
const Sequelize = require('sequelize');

// Kiểm tra người dùng có tồn tại
exports.checkUserExists = async (id) => {
    const adminAccountType = await AccountTypeModel.findOne({
        where: {
            is_admin: true
        }
    })

    const user = await UserModel.findOne({
        where: {
            id: id,
            account_type_id: {
                [Sequelize.Op.ne]: adminAccountType.id
            }
        }
    })

    if(user) return true

    return false;
}
