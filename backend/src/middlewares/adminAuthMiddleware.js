const User = require("../model/User");
const jwtProvider = require("../util/jwtProvider");
const UserRoles = require("../domain/UserRole");

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token and get email
    const email = jwtProvider.getEmailFromjwt(token);

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is admin
    if (user.role !== UserRoles.Admin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminAuthMiddleware;
