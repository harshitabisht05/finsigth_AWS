const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ApiError = require("../utils/apiError");

function sign(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const ex = await User.findOne({ where: { email } });
    if (ex) throw new ApiError(409, "Email is already registered");

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    return res.status(201).json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) { return next(e); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    return res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) { return next(e); }
}

module.exports = { register, login };
