const {sequelize, DataTypes} = require('../configs/db_config')

const CrawlConfigModel = sequelize.define(
    'CrawlConfigModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        crawl_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        result_type_id: {
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
        http_method_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        item_selector: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        headers_api: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        body_api: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        update_at: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'crawl_configs',
        timestamps: false
    }
)

module.exports = CrawlConfigModel