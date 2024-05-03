const {
  signUpUser,
  signInUser,
  likePost,
  applyPost,
  followRecruiter,
  editUserProfile,
  setUserPassword,
  getUserInfo,
} = require("../controllers/userController");

const { authenticateUser } = require("../middlewares/authenticateUser");
const { fileToUrl } = require("../middlewares/fileToUrl");
const { verifyUser } = require("../middlewares/verifyUser");

const userRoute = require("express").Router();

userRoute.post("/signup", signUpUser);
userRoute.post("/signin", signInUser);
userRoute.put("/forgotpassword", setUserPassword);
userRoute.post("/like/:id", authenticateUser, verifyUser, likePost);
userRoute.post(
  "/apply/:id",
  authenticateUser,
  verifyUser,
  fileToUrl,
  applyPost
);
userRoute.post("/follow/:id", authenticateUser, verifyUser, followRecruiter);
userRoute.get("/info", authenticateUser, getUserInfo);
userRoute.post("/modify", authenticateUser, fileToUrl, editUserProfile);

module.exports = {
  userRoute,
};
