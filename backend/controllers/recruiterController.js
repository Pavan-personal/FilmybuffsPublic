const { Post } = require("../models/postModel");
const { Recruiter } = require("../models/recruiterModel");
const { User } = require("../models/userModel");
const { uploadToCloudinary } = require("../utils/cloudinary");
const { generateJWT } = require("../utils/generateJWT");
const { sendSuccessMail } = require("../utils/sendMailUtility");
const { Application } = require("../models/applicationModel");

const verifyToken = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const signUpRecruiter = async (req, res) => {
  try {
    const recruiter = req.body;
    if (recruiter.username && recruiter.password) {
      const exist = await Recruiter.findOne({
        mailId: req.body.mailId,
      });
      const userexist = await Recruiter.findOne({
        username: recruiter.username,
      });
      if (userexist) {
        res.send({ success: false, message: "username already exists!" });
        return;
      }
      if (exist) {
        res.send({ success: false, message: "email already registered!" });
      } else {
        Recruiter.create({
          mailId: recruiter.mailId,
          username: recruiter.username,
          password: recruiter.password,
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
      }
    } else {
      res.send({ success: false, message: "please fill all the details" });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const signInRecruiter = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username && password) {
      const exist = await Recruiter.findOne({
        username: username,
      });
      const psswd = await Recruiter.findOne({
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

const setRecruiterPassword = async (req, res) => {
  try {
    const { password, confirm, email } = req.body;
    if (!email) {
      res.send({ success: false, message: "Please provide email!" });
      return;
    }
    if (password && confirm) {
      if (password === confirm) {
        Recruiter.updateOne(
          { mailId: email },
          {
            $set: {
              password: password,
            },
          }
        )
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

const publishPost = async (req, res) => {
  try {
    const { description, category, title } = req.body;
    const email = await Recruiter.findById(req.user.userID).then((rec) => {
      return rec.mailId;
    });
    if (!(title && description && category)) {
      res.send({ success: false, message: "Please provide details!" });
      return;
    }

    if (!email) {
      res.send({ success: false, message: "please provide email!" });
      return;
    }

    const post = await Post.create({
      title: title,
      description: description,
      category: category,
      attachment: req.attachment ? req.attachment : undefined,
      date: Date.now(),
    }).catch((fail) => {
      res.send({ success: false, message: "Something went wrong!" });
      return;
    });

    const recruiter = await Recruiter.findOneAndUpdate(
      { mailId: email },
      {
        $push: {
          createdPosts: post._id,
        },
      }
    ).catch((fail) => {
      res.send({ success: false, message: "failed" });
      return;
    });

    const updateRecruiter = await Post.findByIdAndUpdate(post._id, {
      $set: {
        postedBy: recruiter._id,
      },
    }).catch((fail) => {
      res.send({ success: fase, message: fail });
      return;
    });

    res.send({
      success: true,
      message: "Post published successfully!",
      url: req.attachment ? req.attachment : undefined,
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const editPost = (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description } = req.body;
    if (title || description || req.attachment) {
      Post.findByIdAndUpdate(postId, {
        $set: {
          title: title ? title : undefined,
          description: description ? description : undefined,
          attachment: req.attachment ? req.attachment : undefined,
        },
      })
        .then((success) => {
          if (success) {
            res.send({
              success: true,
              message: "updated post successfully!",
            });
          } else {
            res.send({
              success: false,
              message: "failed to edit post!",
            });
            return;
          }
        })
        .catch((fail) => {
          res.send({
            success: false,
            message: "failed to edit post!",
          });
          return;
        });
    } else {
      res.send({ success: false, message: "Add atleast one field" });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const removePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId)
      .then((success) => {
        res.send({
          success: true,
          message: "Post removed successfully!",
        });
      })
      .catch((fail) => {
        res.send({ success: false, message: "failed to remove post!" });
      });

    const users = await User.find({}).catch((err) => {
      console.log(err);
      res.send({ success: false, message: "Something went wrong!" });
      return;
    });
    users.forEach(async (user) => {
      await User.findByIdAndUpdate(user._id, {
        $pull: {
          likedPosts: postId,
          appliedPosts: postId,
          acceptedPosts: postId,
        },
      }).catch((err) => {
        console.log(err);
        res.send({ success: false, message: "Something went wrong!" });
        return;
      });
    });

    await Recruiter.findOneAndUpdate(
      { mailId: req.user.email },
      {
        $pull: {
          createdPosts: postId,
        },
      }
    ).catch((err) => {
      console.log(err);
      res.send({ success: false, message: "Something went wrong!" });
      return;
    });

    await Application.deleteMany({ appliedOn: postId }).catch((fail) => {
      res.send({
        success: false,
        message: "failed to applications related to post!",
      });
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const selectUser = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = await User.findOne({ username: req.body.sname }).then(
      (uss) => {
        return uss._id;
      }
    );
    const exists = await Post.findById(postId).then((found) => {
      return found.selectedApplicants.includes(userId);
    });

    if (exists) {
      res.send({
        success: false,
        message: "Applicant already selected!",
      });
    } else {
      const postTitle = await Post.findByIdAndUpdate(postId, {
        $push: {
          selectedApplicants: userId,
        },
      }).then((pst) => {
        return pst.title;
      });
      const user = await User.findByIdAndUpdate(userId, {
        $push: {
          acceptedPosts: postId,
        },
      });
      await sendSuccessMail(user.mailId, user.username, postTitle);
      res.send({
        success: true,
        message: "Applicant selected successfully!",
      });
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const kickUser = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.params.id;
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: {
        applications: userId,
      },
    });
    const user = await User.findByIdAndUpdate(userId, {
      $pull: {
        appliedPosts: postId,
      },
    });
    res.send({ success: true, message: "Successfully kicked user!" });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const blockUser = async (req, res) => {
  try {
    const recruiterId = req.user.userID;
    const userId = await User.findOne({ username: req.params.uname }).then(
      (uss) => {
        return uss._id;
      }
    );
    const check = await Recruiter.findById(recruiterId).then((rec) => {
      return rec.blockList.includes(userId);
    });
    await Recruiter.findByIdAndUpdate(
      recruiterId,
      check
        ? {
            $pull: {
              blockList: userId,
            },
          }
        : {
            $push: {
              blockList: userId,
            },
            $pull: {
              followers: userId,
            },
          }
    );
    await User.findByIdAndUpdate(
      userId,
      check
        ? {
            $pull: {
              blockedBy: recruiterId,
            },
          }
        : {
            $pull: {
              following: recruiterId,
            },
            $push: {
              blockedBy: recruiterId,
            },
          }
    );
    res.send({
      success: true,
      message: check ? "Unblocked user!" : "Blocked User!",
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "something went wrong!" });
  }
};

const editRecruiterProfile = async (req, res) => {
  try {
    const recruiter = req.body;
    const recruiterId = req.user.userID;
    if (
      (recruiter.newUsername && recruiter.newPassword && recruiter.newMailId) ||
      req.attachment ||
      recruiter.insta ||
      recruiter.twitter ||
      recruiter.mobile ||
      recruiter.about
    ) {
      const recruiterNow = await Recruiter.findById(recruiterId);

      const mailExist = await Recruiter.findOne({
        mailId: recruiter.newMailId,
      });

      const userExist = await Recruiter.findOne({
        username: recruiter.newUsername,
      });

      if (userExist && recruiterNow.username !== recruiter.newUsername) {
        res.send({ success: false, message: "username already exists!" });
        return;
      }
      if (mailExist && recruiterNow.mailId !== recruiter.newMailId) {
        res.send({ success: false, message: "email already registered!" });
      } else {
        Recruiter.findByIdAndUpdate(recruiterId, {
          $set: {
            username: recruiter.newUsername ? recruiter.newUsername : undefined,
            password: recruiter.newPassword ? recruiter.newPassword : undefined,
            mailId: recruiter.newMailId ? recruiter.newMailId : undefined,
            profileImage: req.attachment ? req.attachment : undefined,
            instagram: recruiter.insta ? recruiter.insta : undefined,
            twitter: recruiter.twitter ? recruiter.twitter : undefined,
            about: recruiter.about ? recruiter.about : undefined,
            mobileNumber: recruiter.mobile ? recruiter.mobile : undefined,
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

const getRecruiterInfo = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.userID);
    const postLength = recruiter.createdPosts.length;
    const lastDate = postLength>1 ? await Post.findById(
      recruiter.createdPosts[recruiter.createdPosts.length - 1]
    ).then((s) => {
      return s.date;
    }) : postLength === 1? await Post.findById(
      recruiter.createdPosts[0]
    ).then((s) => {
      return s.date;
    }): Date.now();

    const followersList = [];
    recruiter.followers.map(async (user) => {
      const userO = await User.findById(user);
      followersList.push({
        username: userO.username,
        profileImage: userO.profileImage,
      });
    });
    var a = 0,
      b = 0;
    (await Post.find({ postedBy: recruiter._id })).map((post) => {
      a += post.likedBy.length;
      b += post.appliedBy.length;
    });
    console.log(a, b);
    await Recruiter.findById(req.user.userID)
      .then((rec) => {
        res.send({
          success: true,
          data: rec._doc,
          followersList: followersList,
          lastPost: lastDate,
          engagement: [a, b],
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({ success: false, message: "Something went wrong 1!" });
      });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "Something went wrong 2!"});
  }
};

module.exports = {
  signInRecruiter,
  signUpRecruiter,
  publishPost,
  selectUser,
  removePost,
  editPost,
  kickUser,
  blockUser,
  editRecruiterProfile,
  setRecruiterPassword,
  getRecruiterInfo,
};
