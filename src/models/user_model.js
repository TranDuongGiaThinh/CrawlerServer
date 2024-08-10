const {sequelize, DataTypes} = require('../configs/db_config')

const UserModel = sequelize.define(
    'UserModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        account_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        fullname: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        config_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        export_count: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        locked: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'users',
        timestamps: false
    }
)

module.exports = UserModel