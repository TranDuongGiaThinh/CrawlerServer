const {sequelize, DataTypes} = require('../configs/db_config')

const HttpMethodModel = sequelize.define(
    'HttpMethodModel',
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
        have_headers: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        have_body: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'http_methods',
        timestamps: false
    }
)

module.exports = HttpMethodModel