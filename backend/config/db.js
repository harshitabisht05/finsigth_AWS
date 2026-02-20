const { Sequelize } = require("sequelize");

const isSSL = process.env.DB_SSL === "true";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: "mysql",
    logging: false,

    define: {
      underscored: true,
      timestamps: false,
    },

    dialectOptions: isSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : undefined,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Test connection immediately
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Failed:", err.message);
  });

module.exports = sequelize;