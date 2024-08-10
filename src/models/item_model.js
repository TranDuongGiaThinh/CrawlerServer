const {sequelize, DataTypes} = require('../configs/db_config')

const ItemModel = sequelize.define(
    'ItemModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        crawl_config_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        website_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        update_at: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        tableName: 'items',
        timestamps: false
    }
)

module.exports = ItemModel