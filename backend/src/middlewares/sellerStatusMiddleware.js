const AccountStatus = require("../domain/AccountStatus");

const requireActiveSellerStatus = (req, res, next) => {
  const seller = req.seller;

  if (!seller) {
    return res.status(401).json({ message: "Seller not authenticated" });
  }

  if (
    seller.accountStatus === AccountStatus.BANNED ||
    seller.accountStatus === AccountStatus.CLOSED
  ) {
    return res.status(403).json({
      message: `Your account has been ${seller.accountStatus.toLowerCase()}. Please contact support.`,
    });
  }

  if (
    seller.accountStatus === AccountStatus.SUSPENDED ||
    seller.accountStatus === AccountStatus.DEACTIVATED
  ) {
    return res.status(403).json({
      message: `Your account is ${seller.accountStatus.toLowerCase()}. You cannot perform this action. Please contact support.`,
    });
  }

  if (seller.accountStatus !== AccountStatus.ACTIVE) {
    return res.status(403).json({
      message:
        "Your account is not active yet. Please wait for admin verification.",
    });
  }

  next();
};

module.exports = requireActiveSellerStatus;
