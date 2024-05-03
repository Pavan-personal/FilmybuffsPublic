const {
  getPosts,
  getPostLikes,
  viewWhoApplied,
  viewProfile,
  deleteAccountAndRelatedActivities,
} = require("../controllers/openController");
const { authenticateUser } = require("../middlewares/authenticateUser");
const { Recruiter } = require("../models/recruiterModel");
const { User } = require("../models/userModel");

const openRoute = require("express").Router();
const { sendOtp, verifyOtp } = require("../utils/otpNeeds");
openRoute.get("/users", authenticateUser, async (req, res) => {
  const users = await User.find({});
  res.send({ success: true, users: users });
});
openRoute.post("/getotp", sendOtp);
openRoute.post("/verifyotp", verifyOtp);
openRoute.get("/recruiters", authenticateUser, async (req, res) => {
  const recruiters = await Recruiter.find({});
  res.send({ success: true, recruiters: recruiters });
});
openRoute.get("/posts/all", authenticateUser, getPosts);
openRoute.get("/post/likes/:id", authenticateUser, getPostLikes);
openRoute.get("/post/comments/:id", authenticateUser, viewWhoApplied);
openRoute.get("/viewprofile", authenticateUser, viewProfile);
openRoute.delete(
  "/deleteacc",
  authenticateUser,
  deleteAccountAndRelatedActivities
);

module.exports = {
  openRoute,
};
