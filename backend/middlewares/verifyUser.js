const { Post } = require("../models/postModel");
const { Recruiter } = require("../models/recruiterModel");
const { User } = require("../models/userModel");

const verifyUser = async (req, res, next) => {
  try {
    const mailId = await User.findById(req.user.userID).then((uss) => {
      return uss.mailId;
    });
    if (!mailId) {
      res.send({ success: false, messaage: "Please provide email!" });
      return;
    }
    req.mail = mailId;
    const user = await User.findOne({ mailId: mailId });
    const searchId = req.params.id;
    if (!req.body.factor) {
      res.send({ success: false, message: "Provide factor!" });
      return;
    }
    const factor = req.body.factor;
    if (factor === "p") {
      const recruiter = await Post.findById(searchId)
        .then((post) => {
          return post.postedBy;
        })
        .catch((fail) => {
          res.send({ success: false, message: "Something went wrong! 1" });
        });
      const check = await Recruiter.findById(recruiter)
        .then((rec) => {
          return rec.blockList.includes(user._id);
        })
        .catch((fail) => {
          res.send({ success: false, message: "Something went wrong! 2" });
        });
      if (check) {
        res.send({
          success: false,
          message: "Sorry! You're restricted by the recruiter!",
        });
        return;
      } else {
        next();
      }
    } else {
      const check = await Recruiter.findById(searchId)
        .then((rec) => {
          return rec.blockList.includes(user._id);
        })
        .catch((fail) => {
          res.send({ success: false, message: "Something went wrong! 3" });
          return;
        });
      if (check) {
        res.send({
          success: false,
          message: "Sorry! You're restricted by the recruiter!",
        });
        return;
      } else {
        next();
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong! 4" });
  }
};

module.exports = {
  verifyUser,
};
