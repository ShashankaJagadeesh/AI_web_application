const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// defining the user model with id, username and password
const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true  //Keeping timestamps to mark when users are created/updated
});

module.exports = User;
