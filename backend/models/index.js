const sequelize = require("../config/db");
const User = require("./User");
const AwsAccount = require("./AwsAccount");
const Alert = require("./Alert");

User.hasMany(AwsAccount, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Alert, { foreignKey: "user_id", onDelete: "CASCADE" });
AwsAccount.belongsTo(User, { foreignKey: "user_id" });
Alert.belongsTo(User, { foreignKey: "user_id" });

module.exports = { sequelize, User, AwsAccount, Alert };
