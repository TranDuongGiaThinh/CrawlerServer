const {sequelize, DataTypes} = require('../configs/db_config')

const DataModel = sequelize.define(
    'DataModel',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'data',
        timestamps: false
    }
)

module.exports = DataModel