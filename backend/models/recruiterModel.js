const { default: mongoose, mongo } = require("mongoose");

const recruiterModel = new mongoose.Schema({
  username: String,
  password: String,
  profileImage: String,
  about: String,
  mobileNumber: String,
  mailId: String,
  twitter: String,
  instagram: String,
  location: String,
  createdPosts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  blockList: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Recruiter = mongoose.model("Recruiter", recruiterModel);

module.exports = {
  Recruiter,
};
