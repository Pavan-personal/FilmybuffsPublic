const { default: mongoose } = require("mongoose");

const postModel = new mongoose.Schema({
  title: String,
  description: String,
  attachment: String,
  date: Date,
  category: String,
  postedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Recruiter",
  },
  likedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  appliedBy: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  selectedApplicants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Post = mongoose.model("Post", postModel);

module.exports = {
  Post,
};
