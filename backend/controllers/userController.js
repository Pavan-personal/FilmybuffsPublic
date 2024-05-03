const { Application } = require("../models/applicationModel");
const { Post } = require("../models/postModel");
const { Recruiter } = require("../models/recruiterModel");
const { User } = require("../models/userModel");
const { generateJWT } = require("../utils/generateJWT");

const signUpUser = async (req, res) => {
  try {
    const user = req.body;
    if (!user.mailId) {
      res.send({ success: false, message: "please provide email" });
      return;
    }
    const exist = await User.findOne({
      mailId: user.mailId,
    });
    if (exist) {
      res.send({ success: false, message: "account already exists" });
      return;
    }
    if (user.username && user.password) {
      const userexist = await User.findOne({
        username: user.username,
      });
      if (userexist) {
        res.send({ success: false, message: "username already exists!" });
        return;
      }
      User.create({
        mailId: user.mailId,
        username: user.username,
        password: user.password,
      })
        .then(async (created) => {
          const token = await generateJWT({ userID: created._id });
          res.send({
            success: true,
            message: "account created successfully!",
            token: token,
          });
        })
        .catch((failed) => {
          res.send({ success: false, message: "failed to create account" });
        });
    } else {
      res.send({ success: false, message: "please fill all the details" });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const signInUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const exist = await User.findOne({
        username: username,
      });
      const psswd = await User.findOne({
        password: password,
      });

      if (exist) {
        if (psswd) {
          const token = await generateJWT({
            userID: exist._id,
          });
          res.send({
            success: true,
            message: "signin successfull!",
            token: token,
          });
        } else {
          res.send({ success: false, message: "Incorrect password!" });
        }
      } else {
        res.send({ success: false, message: "username doesn't exist" });
      }
    } else {
      res.send({ success: false, message: "please fill all the details" });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const setUserPassword = (req, res) => {
  try {
    const { password, confirm, email } = req.body;
    if (!email) {
      res.send({ success: false, message: "Please provide email!" });
      return;
    }
    if (password && confirm) {
      if (password === confirm) {
        User.findByIdAndUpdate(req.user.userID, {
          $set: {
            password: password,
          },
        })
          .then((success) => {
            res.send({
              success: true,
              message: "updated password successfully!",
            });
          })
          .catch((fail) => {
            res.send({ success: false, message: "failed to update password!" });
          });
      } else {
        res.send({ success: false, message: "passwords doesn't match!" });
      }
    } else {
      res.send({ success: false, message: "please fill all the details" });
    }
  } catch (error) {
    res.send({ success: false, message: "something went wrong!" });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (postId) {
      const check = await User.findById(req.user.userID).then(
        (user) => {
          return user.likedPosts.includes(postId);
        }
      );
      const user = await User.findByIdAndUpdate(
        req.user.userID,
        check
          ? {
              $pull: {
                likedPosts: postId,
              },
            }
          : {
              $push: {
                likedPosts: postId,
              },
            }
      ).catch((fail) => {
        console.log(fail);
        res.send({ success: false, message: "Something went wrong!" });
        return;
      });

      const post = await Post.findByIdAndUpdate(
        postId,
        check
          ? {
              $pull: {
                likedBy: user._id,
              },
            }
          : {
              $push: {
                likedBy: user._id,
              },
            }
      ).catch((fail) => {
        console.log(fail);
        res.send({ success: false, message: "Something went wrong!" });
        return;
      });

      if (post != null) {
        res.send({
          success: true,
          message: check ? "Unliked Post!" : "Liked Post!",
        });
      } else {
        res.send({ success: false, message: "Something went wrong!" });
        return;
      }
    } else {
      res.send({ success: false, message: "Please mention post!" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const applyPost = async (req, res) => {
  try {
    if (req.params.id && (req.attachment || req.body.portfolio)) {
      const recruiter = await Post.findById(req.params.id).then((rec) => {
        return rec.postedBy;
      });
      await Post.findById(req.params.id).then(async (pst) => {
        if (pst.appliedBy.includes(req.user.userID)) {
          res.send({ success: false, message: "already applied!!" });
          return;
        } else {
          await Post.findByIdAndUpdate(req.params.id, {
            $push: {
              appliedBy: req.user.userID,
            },
          });

          await User.findByIdAndUpdate(req.user.userID, {
            $push: { appliedPosts: req.params.id },
          });

          await Application.create({
            description: req.body.description
              ? req.body.description
              : undefined,
            attachment: req.attachment
              ? req.attachment
              : req.body.portfolio
              ? req.body.portfolio
              : undefined,
            appliedOn: req.params.id,
            org: recruiter,
            appliedBy: req.user.userID,
          })
            .catch((fail) => {
              res.send({ success: false, message: "something went wrong!" });
              return;
            })
            .then((ss) => {
              res.send({ success: true, message: "applied successfully!" });
            });
        }
      });
    } else {
      res.send({ success: false, message: "Please provide details!" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const followRecruiter = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    if (recruiterId) {
      const check = await User.findById(req.user.userID).then((user) => {
        return user.following.includes(recruiterId);
      });
      const user = await User.findByIdAndUpdate(
        req.user.userID,
        check
          ? {
              $pull: {
                following: recruiterId,
              },
            }
          : {
              $push: {
                following: recruiterId,
              },
            }
      ).catch((fail) => {
        console.log(fail);
        res.send({ success: false, message: "Something went wrong!" });
      });

      const recruiter = await Recruiter.findByIdAndUpdate(
        recruiterId,
        check
          ? {
              $pull: {
                followers: user._id,
              },
            }
          : {
              $push: {
                followers: user._id,
              },
            }
      ).catch((fail) => {
        console.log(fail);
        res.send({ success: false, message: "Something went wrong!" });
      });

      if (recruiter != null) {
        res.send({
          success: true,
          message: check
            ? `Unfollowed ${recruiter.username}!`
            : `Following ${recruiter.username}!`,
        });
      } else {
        res.send({ success: false, message: "Something went wrong!" });
        return;
      }
    } else {
      if (recruiterId) {
        res.send({ success: false, message: "Please provide username!" });
        return;
      } else {
        res.send({ success: false, message: "Please mention recruiter!" });
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const applicationsList = await Application.findById(req.user.userID);
    const following = await User.findById(req.user.userID).then((uss) => {
      return uss.following;
    });
    const followingList = [];
    following.map(async (user) => {
      const recruiter = await Recruiter.findById(user);
      followingList.push({
        username: recruiter.username,
        profileImage: recruiter.profileImage,
      });
    });
    await User.findById(req.user.userID)
      .then((uss) => {
        res.send({
          success: true,
          data: uss._doc,
          applicationsList: applicationsList,
          followingList: followingList,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ success: false, message: "Something went wrong!" });
      });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const editUserProfile = async (req, res) => {
  try {
    const user = req.body;
    const userId = req.user.userID;
    if (
      (user.newUsername && user.newPassword && user.newMailId) ||
      req.attachment ||
      (user.insta && user.twitter && user.mobile && user.about)
    ) {
      const userNow = await User.findById(userId);

      const mailExist = await User.findOne({
        mailId: user.newMailId,
      });

      const userExist = await User.findOne({
        username: user.newUsername,
      });

      if (userExist && userNow.username !== user.newUsername) {
        res.send({ success: false, message: "username already exists!" });
        return;
      }
      if (mailExist && userNow.mailId !== user.newMailId) {
        res.send({ success: false, message: "email already registered!" });
      } else {
        User.findByIdAndUpdate(userId, {
          $set: {
            username: user.newUsername ? user.newUsername : undefined,
            password: user.newPassword ? user.newPassword : undefined,
            mailId: user.newMailId ? user.newMailId : undefined,
            profileImage: req.attachment ? req.attachment : undefined,
            instagram: user.insta ? user.insta : undefined,
            twitter: user.twitter ? user.twitter : undefined,
            about: user.about ? user.about : undefined,
            mobileNumber: user.mobile ? user.mobile : undefined,
          },
        }).then(async (s) => {
          res.send({
            success: true,
            message: "updated profile successfully!",
          });
          return;
        });
      }
    } else {
      res.send({ success: false, message: "please provide details" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const deleteAccount = async () => {};

module.exports = {
  signUpUser,
  signInUser,
  likePost,
  applyPost,
  followRecruiter,
  editUserProfile,
  setUserPassword,
  getUserInfo,
};
