const { default: mongoose, Schema } = require("mongoose");

const verificationCodeSchema = new Schema({
  otp: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: 600 },
});

const VerificationCode = mongoose.model(
  "VerificationCode",
  verificationCodeSchema
);

module.exports = VerificationCode;
