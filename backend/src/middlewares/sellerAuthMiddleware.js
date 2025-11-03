const sellerService = require("../service/sellerService");
const jwtProvider = require("../util/jwtProvider");
const AccountStatus = require("../domain/AccountStatus"); // ✅ ADD THIS IMPORT

const sellerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let email;
    try {
      email = jwtProvider.getEmailFromjwt(token);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const seller = await sellerService.getSellerByEmail(email);

    if (!seller) {
      return res.status(401).json({ message: "Seller not found" });
    }

 
    if (seller.accountStatus !== AccountStatus.ACTIVE) {
      const messages = {
        PENDING_VERIFICATION:
          "Your account is pending verification. Please wait for admin approval.",
        SUSPENDED: "Your account has been suspended. Please contact support.",
        DEACTIVATED:
          "Your account has been deactivated. Please contact support.",
        BANNED: "Your account has been banned. Please contact support.",
        CLOSED: "Your account has been closed. Please contact support.",
      };

      return res.status(403).json({
        message: messages[seller.accountStatus] || "Account access denied.",
        accountStatus: seller.accountStatus, 
      });
    }

    req.seller = seller;
    next();
  } catch (error) {
    console.error("Seller middleware error:", error);
    res.status(500).json({ message: "Internal server error in middleware" });
  }
};

module.exports = sellerMiddleware;
