const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AwsAccount = sequelize.define("aws_accounts", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  role_arn: { type: DataTypes.STRING(500), allowNull: false },
  external_id: { type: DataTypes.STRING(255), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "aws_accounts",
  timestamps: false,
});

module.exports = AwsAccount;
