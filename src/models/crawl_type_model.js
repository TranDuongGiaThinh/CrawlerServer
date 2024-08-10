const {sequelize, DataTypes} = require('../configs/db_config')

const CrawlTypeModel = sequelize.define(
    'CrawlTypeModel',
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
        have_http_method: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        have_actions: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'crawl_types',
        timestamps: false
    }
)

module.exports = CrawlTypeModel