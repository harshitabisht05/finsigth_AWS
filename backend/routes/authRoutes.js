const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");
const { validateRequest } = require("../middleware/validate");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("Register request received:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const [existing] = await sequelize.query(
      "SELECT id FROM users WHERE email = ?",
      {
        replacements: [email],
      }
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await sequelize.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      {
        replacements: [name, email, hashedPassword],
      }
    );

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

router.post("/login", [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  validateRequest,
], login);

module.exports = router;
