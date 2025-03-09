const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Import Sequelize connection

const Query = sequelize.define("Query", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    query_text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    option_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "queries",
    timestamps: true 
});

module.exports = Query;
