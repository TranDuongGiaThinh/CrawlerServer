const {sequelize, DataTypes} = require('../configs/db_config')

const WebsiteModel = sequelize.define(
    'WebsiteModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'websites',
        timestamps: false
    }
)

module.exports = WebsiteModel