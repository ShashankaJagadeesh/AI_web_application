const { Sequelize } = require("sequelize");
require("dotenv").config();

// Using Sequalize to initialize connection to MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging: false
    }
);

// Code to test connection
sequelize.authenticate()
    .then(() => console.log("Database Connected Successfully!"))
    .catch(err => console.error("Database Connection Error:", err));

module.exports = sequelize;
