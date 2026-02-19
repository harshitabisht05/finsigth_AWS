const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");
const { validateRequest } = require("../middleware/validate");

const router = express.Router();

router.post("/register", [
  body("name").trim().notEmpty().isLength({ max: 100 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8, max: 100 }),
  validateRequest,
], register);

router.post("/login", [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  validateRequest,
], login);

module.exports = router;
