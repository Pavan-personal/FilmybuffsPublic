const {
  signUpRecruiter,
  signInRecruiter,
  setRecruiterPassword,
  publishPost,
  selectUser,
  removePost,
  editPost,
  kickUser,
  blockUser,
  editRecruiterProfile,
  getRecruiterInfo,
} = require("../controllers/recruiterController");
const {
  authenticateRecruiter,
} = require("../middlewares/authenticateRecruiter");

const { fileToUrl } = require("../middlewares/fileToUrl");
const { verifyRecruiter } = require("../middlewares/verifyRecruiter");

const recruiterRoute = require("express").Router();

recruiterRoute.post("/signup", signUpRecruiter);
recruiterRoute.post("/signin", signInRecruiter);
recruiterRoute.put("/forgotpassword", setRecruiterPassword);
recruiterRoute.post("/publish", authenticateRecruiter, fileToUrl, publishPost);
recruiterRoute.put(
  "/edit/:id",
  authenticateRecruiter,
  verifyRecruiter,
  fileToUrl,
  editPost
);
recruiterRoute.delete(
  "/remove/:id",
  authenticateRecruiter,
  verifyRecruiter,
  removePost
);
recruiterRoute.post(
  "/select",
  authenticateRecruiter,
  verifyRecruiter,
  selectUser
);
recruiterRoute.delete(
  "/spam/:id",
  authenticateRecruiter,
  verifyRecruiter,
  kickUser
);
recruiterRoute.delete("/block/:uname", authenticateRecruiter, blockUser);
recruiterRoute.get("/info", authenticateRecruiter, getRecruiterInfo);
recruiterRoute.post(
  "/modify",
  authenticateRecruiter,
  fileToUrl,
  editRecruiterProfile
);

module.exports = {
  recruiterRoute,
};
