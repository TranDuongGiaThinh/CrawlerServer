const {sequelize, DataTypes} = require('../configs/db_config')

const RenewalPackageModel = sequelize.define(
    'RenewalPackageModel',
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
        promotion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        days: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {
        tableName: 'renewal_packages',
        timestamps: false
    }
)

module.exports = RenewalPackageModel