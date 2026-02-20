const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const sslOptions = process.env.DB_SSL === "true"
  ? {
      require: true,
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
    }
  : false;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false,

    dialectOptions: {
      ssl: sslOptions,
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test connection
sequelize.authenticate()
  .then(() => console.log("✅ Aiven MySQL Connected"))
  .catch(err => console.error("❌ DB Error:", err));

module.exports = sequelize;