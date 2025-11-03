const User = require("../model/User");

const getUserProfileByJwt = async (req, res) => {
  try {
    const user = await req.user;
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { fullName, mobile, profilePicture } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, mobile, profilePicture },
      { new: true },
    );
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserProfileByJwt, updateUserProfile };
