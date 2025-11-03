const sellerService = require("../service/sellerService");
const userService = require("../service/userService");
const jwtProvider = require("../util/jwtProvider");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("AUTH HEADER:", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ message: "Invalid token, authorization failed" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Invalid token, authorization failed" });
    }

    const email = jwtProvider.getEmailFromjwt(token);
    console.log("EMAIL FROM TOKEN:", email);

    const user = await userService.findUserByEmail(email);
    console.log("USER FOUND:", user);

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, authorization failed" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = authMiddleware;
