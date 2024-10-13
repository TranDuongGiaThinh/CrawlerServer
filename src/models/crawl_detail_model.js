const {sequelize, DataTypes} = require('../configs/db_config')

const CrawlDetailModel = sequelize.define(
    'CrawlDetailModel',
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
        sort_index: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        data_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        selector: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        attribute: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: 'crawl_details',
        timestamps: false
    }
)

module.exports = CrawlDetailModel