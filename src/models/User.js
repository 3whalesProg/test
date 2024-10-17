const sequelize = require("../../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  full_name: { type: DataTypes.STRING(52) },
  role: { type: DataTypes.STRING(52) }, //не знаю обязательные это параметры или нет поэтому не делаю allowNull
  efficiency: { type: DataTypes.INTEGER },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

module.exports = {
    User
}
  