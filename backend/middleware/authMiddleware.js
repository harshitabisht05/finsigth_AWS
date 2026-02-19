const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id, { attributes: ["id", "name", "email"] });
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
