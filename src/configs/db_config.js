const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config();

const db = {
    database: process.env.database,
    username: process.env.db_username,
    password: process.env.password,
    host: process.env.host,
    dialect: process.env.dialect
};

const sequelize = new Sequelize(
    db.database,
    db.username,
    db.password,
    {
        host: db.host,
        dialect: db.dialect,
        logging: false
    }
);

module.exports = {sequelize, DataTypes};