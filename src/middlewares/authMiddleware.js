const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("Authorization Header:", authHeader); // Debugging line
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing!" });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Token is missing!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized!", error: error.message });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied! , Only admin can access.",
    });
  }
  next();
};

const isTeacher = async (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      message: "Access denied! , Only teacher can access.",
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
  isTeacher,
};
