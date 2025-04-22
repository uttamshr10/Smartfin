// we will add code for protecting routes

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token found" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
