const { default: mongoose } = require("mongoose");

const applicationModel = new mongoose.Schema({
  description: String,
  attachment: String,
  appliedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  appliedOn: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
  },
  org: {
    type: mongoose.Types.ObjectId,
    ref: "Recruiter"
  }
});

const Application = mongoose.model("Application", applicationModel);

module.exports = {
  Application,
};
