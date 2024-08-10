const {sequelize, DataTypes} = require('../configs/db_config')

const SettingModel = sequelize.define(
    'SettingModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        app_file_path: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        instruction_file_path: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        introduction: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        footer: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'setting',
        timestamps: false
    }
)

module.exports = SettingModel