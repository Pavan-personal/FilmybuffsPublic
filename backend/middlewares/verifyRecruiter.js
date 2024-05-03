const { default: mongoose } = require("mongoose");
const { Post } = require("../models/postModel");
const { Recruiter } = require("../models/recruiterModel");

const verifyRecruiter = async (req, res, next) => {
  try {
    const email = await Recruiter.findById(req.user.userID).then((rec) => {
      return rec.mailId;
    });
    req.user.email = email;
    if (!email) {
      res.send({
        success: false,
        message: "please provide recruiter details!",
      });
      return;
    }
    const recruiterId = await Recruiter.findOne({ mailId: email }).then((r) => {
      return r._id;
    });
    const postId = req.body.postId || req.params.id;
    if (postId && recruiterId) {
      const newRecruiterId = new mongoose.Types.ObjectId(recruiterId);
      const valid = await Post.findById(postId)
        .then((found) => {
          return found.postedBy.equals(newRecruiterId);
        })
        .catch((err) => {
          return;
        });
      if (!valid) {
        res.send({
          success: false,
          message: "Permission denied!",
        });
        return;
      } else {
        next();
      }
    } else {
      res.send({
        success: false,
        message: "please provide post details!",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "Something went wrong!" });
    return;
  }
};

module.exports = {
  verifyRecruiter,
};
