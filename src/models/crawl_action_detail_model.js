const {sequelize, DataTypes} = require('../configs/db_config')

const CrawlActionDetailModel = sequelize.define(
    'CrawlActionDetailModel',
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
        action_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sort_index: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        selector: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        is_list: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'crawl_action_details',
        timestamps: false
    }
)

module.exports = CrawlActionDetailModel