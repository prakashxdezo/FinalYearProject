const UserRoles = require("../domain/UserRole");
const VerificationCode = require("../model/VerificationCode");
const sellerService = require("../service/sellerService");
const jwtProvider = require("../util/jwtProvider");
const sendVerificationEmail = require("../util/sendEmail");
const generateOTP = require("../util/generateOtp");
const AccountStatus = require("../domain/AccountStatus");

class SellerController {
  async getSellerProfile(req, res) {
    try {
      const profile = req.seller;
      console.log("profile", profile);
      const jwt = req.headers.authorization.split(" ")[1];
      const seller = await sellerService.getSellerProfile(jwt);
      res.status(200).json(seller);
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async createSeller(req, res) {
    try {
      const seller = await sellerService.createSeller(req.body);
      res.status(200).json({ message: "seller created successfully" });
    } catch (error) {
      console.log("error creating", error);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async getAllSellers(req, res) {
    try {
      const status = req.query.status;
      const seller = await sellerService.getAllSellers(status);
      res.status(200).json(seller);
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async updateSeller(req, res) {
    try {
      const existingSeller = req.seller;
      console.log("Controller req.seller:", existingSeller);
      console.log("Controller req.body:", req.body);
      const seller = await sellerService.updateSeller(existingSeller, req.body);
      console.log("Controller updatedSeller:", seller);
      res.status(200).json(seller);
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async deleteSeller(req, res) {
    try {
      const seller = await sellerService.deleteSeller(req.params.id);
      res.status(200).json({ message: "seller deleted.." });
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async updateSellerAccountStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body; // ✅ FIX: was req.params.status (always undefined)

      if (!id) {
        return res.status(400).json({ message: "Seller ID is required" });
      }

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const validStatuses = [
        "PENDING_VERIFICATION",
        "ACTIVE",
        "SUSPENDED",
        "DEACTIVATED",
        "BANNED",
        "CLOSED",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const updatedSeller = await sellerService.updateSellerStatus(id, status);

      if (!updatedSeller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      res.status(200).json(updatedSeller);
    } catch (error) {
      console.error("updateSellerAccountStatus error:", error);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async sendLoginOtp(req, res) {
    try {
      const { email } = req.body;

      const seller = await sellerService.getSellerByEmail(email);
      if (!seller) {
        return res
          .status(404)
          .json({ message: "Seller not found with this email" });
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

      const otp = generateOTP();
      await VerificationCode.deleteMany({ email });
      await VerificationCode.create({ email, otp });

      await sendVerificationEmail(
        email,
        "Seller Login OTP",
        `<h3>Your login OTP is: <strong>${otp}</strong></h3><p>Valid for 10 minutes.</p>`,
      );

      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.log("sendLoginOtp error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async verifyLoginOtp(req, res) {
    try {
      const { otp, email } = req.body;
      const seller = await sellerService.getSellerByEmail(email);

      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      // ✅ FIX: Block ALL non-ACTIVE statuses, not just BANNED/CLOSED
      // Previously SUSPENDED, DEACTIVATED, PENDING_VERIFICATION
      // sellers could still log in and get a valid JWT token
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

      const verificationCode = await VerificationCode.findOne({ email });
      if (!verificationCode || verificationCode.otp != otp) {
        throw new Error("Invalid OTP!");
      }

      // ✅ Clean up used OTP
      await VerificationCode.deleteMany({ email });

      const token = jwtProvider.createJwt({ email });

      return res.status(200).json({
        message: "Login Success",
        jwt: token,
        role: UserRoles.SELLER,
        accountStatus: seller.accountStatus,
      });
    } catch (error) {
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async updateSellerProfile(req, res) {
    try {
      const { sellerName, mobile, profilePicture, businessDetails } = req.body;
      const Seller = require("../model/Seller");
      const updated = await Seller.findByIdAndUpdate(
        req.seller._id,
        { sellerName, mobile, profilePicture, businessDetails },
        { new: true },
      );
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SellerController();
