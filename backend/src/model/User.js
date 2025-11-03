const { default: mongoose } = require("mongoose");
const UserRoles = require("../domain/UserRole");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
  },

  mobile: {
    type: String,
  },

  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
  ],

  role: {
    type: String,
    enum: [UserRoles.CUSTOMER, UserRoles.Admin],
    default: UserRoles.CUSTOMER,
  },
  
  profilePicture: {
    type: String,
    default: "",
  },
});

const User=mongoose.model("User", userSchema);

module.exports = User;