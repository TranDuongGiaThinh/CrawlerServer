const {sequelize, DataTypes} = require('../configs/db_config')

const AutoCrawlModel = sequelize.define(
    'AutoCrawlModel',
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
        crawl_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        expiry_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        update_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        is_crawling: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'auto_crawls',
        timestamps: false
    }
)

module.exports = AutoCrawlModel
