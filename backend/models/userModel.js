const { default: mongoose } = require("mongoose");

const userModel = new mongoose.Schema({
  username: String,
  password: String,
  category: String,
  profileImage: String,
  about: String,
  mobileNumber: String,
  location: String,
  mailId: String,
  twitter: String,
  instagram: String,
  likedPosts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  appliedPosts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  acceptedPosts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  following: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Recruiter",
    },
  ],
  blockedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Recruiter",
    },
  ],
});

const User = mongoose.model("User", userModel);

module.exports = {
  User,
};
