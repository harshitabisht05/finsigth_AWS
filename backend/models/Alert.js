const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Alert = sequelize.define("alerts", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: { type: DataTypes.ENUM("info", "warning"), allowNull: false, defaultValue: "info" },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "alerts",
  timestamps: false,
});

module.exports = Alert;
