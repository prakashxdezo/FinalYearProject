const { default: mongoose } = require("mongoose");
const UserRoles = require("../domain/UserRole");
const AccountStatus = require("../domain/AccountStatus");

const sellerSchema = new mongoose.Schema(
  {
    sellerName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, //preventing password to send in api responses while trying to fetch user
    },
    businessDetails: {
      businessName: {
        type: String,
      },
      businessEmail: {
        type: String,
      },
      businessMobile: {
        type: String,
      },
      businessAddress: {
        type: String,
      },
    },
    bankDetails: {
      accountNumber: {
        type: String,
      },
      accountHolderName: {
        type: String,
      },
      bankName: {
        type: String,
      },
      ifscCode: {
        type: String,
      },
    },
    pickupAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    GSTIN: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: [UserRoles.SELLER],
      default: UserRoles.SELLER,
    },
    accountStatus: {
      type: String,
      enum: [
        AccountStatus.PENDING_VERIFICATION,
        AccountStatus.ACTIVE,
        AccountStatus.SUSPENDED,
        AccountStatus.DEACTIVATED,
        AccountStatus.BANNED,
        AccountStatus.CLOSED,
      ],
      default: AccountStatus.PENDING_VERIFICATION,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;