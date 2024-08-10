const {sequelize, DataTypes} = require('../configs/db_config')

const PackageUserModel = sequelize.define(
    'PackageUserModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_type: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        renewal_package: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        days: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        max_config_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        max_export_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        max_export_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        craete_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'package_users',
        timestamps: false
    }
)

module.exports = PackageUserModel