const {sequelize, DataTypes} = require('../configs/db_config')

const CrawlActionTypeModel = sequelize.define(
    'CrawlActionTypeModel',
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
        have_selector: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'crawl_action_types',
        timestamps: false
    }
)

module.exports = CrawlActionTypeModel