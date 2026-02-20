const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

/*
========================================
SECURITY & BASIC MIDDLEWARE
========================================
*/

app.use(helmet());
app.use(morgan("dev"));

/*
========================================
BODY PARSER
========================================
*/

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/*
========================================
CORS CONFIGURATION (FIXED FOR CLOUDFLARE PAGES + RENDER)
========================================
*/

// Read allowed origins from Render env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {

    // Allow Postman, Thunder Client, curl (no origin)
    if (!origin) {
      return callback(null, true);
    }

    // Allow exact allowed origins from env
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow ALL Cloudflare Pages preview & production domains
    if (origin.endsWith(".pages.dev")) {
      return callback(null, true);
    }

    // Allow localhost for development
    if (
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1")
    ) {
      return callback(null, true);
    }

    // Otherwise block
    return callback(new Error("Not allowed by CORS: " + origin));
  },

  credentials: true
}));

/*
========================================
HEALTH CHECK ROUTE
========================================
*/

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running"
  });
});

/*
========================================
API ROUTES
========================================
*/

app.use("/api", routes);

/*
========================================
ERROR HANDLING
========================================
*/

app.use(notFound);
app.use(errorHandler);

module.exports = app;