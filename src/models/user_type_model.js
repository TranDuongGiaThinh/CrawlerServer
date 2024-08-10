const {sequelize, DataTypes} = require('../configs/db_config')

const UserTypeModel = sequelize.define(
    'UserTypeModel',
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
        max_auto_config: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        max_config: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        max_export: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deleted: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'user_types',
        timestamps: false
    }
)

module.exports = UserTypeModel