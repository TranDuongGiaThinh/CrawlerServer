const {sequelize, DataTypes} = require('../configs/db_config')

const CrawlResultTypeModel = sequelize.define(
    'CrawlResultTypeModel',
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
        }
    },
    {
        tableName: 'crawl_result_types',
        timestamps: false
    }
)

module.exports = CrawlResultTypeModel