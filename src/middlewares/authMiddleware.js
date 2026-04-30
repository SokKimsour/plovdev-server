const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

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


// CHECK IF STUDENT IS ENROLLED IN COURSE
const isEnrolled = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { courseId } = req.params

    const enrollment = await enrollments.findOne({
      where: { userId, courseId }
    })

    if (!enrollment) {
      return res.status(403).json({ message: 'You are not enrolled in this course!' })
    }

    next()
  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

module.exports = {
  authenticateToken,
  isAdmin,
  isTeacher,
  isEnrolled
};
