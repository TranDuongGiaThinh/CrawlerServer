const {sequelize, DataTypes} = require('../configs/db_config')

const ItemDetailModel = sequelize.define(
    'ItemDetailModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_primary_key: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        is_detail_url: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        is_contain_keywords: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'item_details',
        timestamps: false
    }
)

module.exports = ItemDetailModel