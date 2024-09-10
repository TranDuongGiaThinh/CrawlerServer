const {sequelize, DataTypes} = require('../configs/db_config')

const AccountTypeModel = sequelize.define(
    'AccountTypeModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'account_types',
        timestamps: false
    }
)

module.exports = AccountTypeModel