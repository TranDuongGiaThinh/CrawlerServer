const {sequelize, DataTypes} = require('../configs/db_config')

const CrawlDataTypeModel = sequelize.define(
    'CrawlDataTypeModel',
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
        have_value: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        crawl_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: 'crawl_data_types',
        timestamps: false
    }
)

module.exports = CrawlDataTypeModel