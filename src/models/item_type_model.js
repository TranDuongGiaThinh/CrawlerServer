const {sequelize, DataTypes} = require('../configs/db_config')

const ItemTypeModel = sequelize.define(
    'ItemTypeModel',
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'item_types',
        timestamps: false
    }
)

module.exports = ItemTypeModel