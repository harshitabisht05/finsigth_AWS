require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");
const { initScheduler } = require("./services/schedulerService");

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    initScheduler();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
