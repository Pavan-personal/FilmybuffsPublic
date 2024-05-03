const { response, application } = require("express");
const { Post } = require("../models/postModel");
const { Recruiter } = require("../models/recruiterModel");
const { User } = require("../models/userModel");
const { Application } = require("../models/applicationModel");

// const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({});
//     const postsWithRecruiterInfo = await Promise.all(
//       posts.map(async (post) => {
//         const postId = post._id;
//         console.log(postId);
//         const rec = await Recruiter.findById(post.postedBy);
//         const profileImage = rec.profileImage;
//         const username = rec.username;
//         const applications = [];
//         const likes = [];
//         const selected = [];
//         const blockList = [];

//         rec.blockList.forEach(async (uss) => {
//           const uname = await User.findById(uss).then((us) => {
//             blockList.push(us.username);
//           });
//         });
//         const appliedResponse = await Post.findById(postId).then((pst) => {
//           return pst.appliedBy;
//         });

//         (await User.find({})).filter(async (uss) => {
//           if (appliedResponse.includes(uss._id)) {
//             const applcn = await Application.findOne({
//               appliedBy: uss._id,
//               appliedOn: postId,
//             });
//             applications.push({
//               attachment: applcn.attachment,
//               description: applcn.description,
//               mail: uss.mailId,
//               username: uss.username,
//               profileImage: uss.profileImage,
//             });
//           }
//         });

//         const likedResponse = await Post.findById(postId).then((pst) => {
//           return pst.likedBy;
//         });
//         (await User.find({})).filter((uss) => {
//           if (likedResponse.includes(uss._id)) {
//             likes.push({
//               username: uss.username,
//               profileImage: uss.profileImage,
//             });
//           }
//         });
//         const selectedResponse = await Post.findById(postId).then((pst) => {
//           return pst.selectedApplicants;
//         });
//         (await User.find({})).filter((uss) => {
//           if (selectedResponse.includes(uss._id)) {
//             selected.push({
//               id: uss._id,
//               username: uss.username,
//               profileImage: uss.profileImage,
//             });
//           }
//         });

//         return {
//           ...post._doc,
//           profileImage,
//           username,
//           likes: likes,
//           applications: applications,
//           selections: selected,
//           blockList: blockList,
//         };
//       })
//     );
//     res.send({ success: true, posts: postsWithRecruiterInfo });
//   } catch (error) {
//     console.log(error);
//     res.send({ success: false, message: "Something went wrong!" });
//   }
// };
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    const postsWithRecruiterInfo = await Promise.all(
      posts.map(async (post) => {
        if (!post) {
          return null; // If post is null or undefined, return null
        }

        const recruiter = await Recruiter.findById(post.postedBy);
        if (!recruiter) {
          throw new Error("Recruiter not found");
        }

        const blockList = await Promise.all(
          recruiter.blockList.map(async (userId) => {
            const user = await User.findById(userId);
            return user ? user.username : null;
          })
        );

        const applications = await Promise.all(
          post.appliedBy.map(async (userId) => {
            const user = await User.findById(userId);
            if (!user) return null;
            const application = await Application.findOne({
              appliedBy: user._id,
              appliedOn: post._id,
            });
            return {
              attachment: application ? application.attachment : null,
              description: application ? application.description : null,
              mail: user.mailId,
              username: user.username,
              profileImage: user.profileImage,
            };
          })
        );

        const likes = await Promise.all(
          post.likedBy.map(async (userId) => {
            const user = await User.findById(userId);
            return user
              ? { username: user.username, profileImage: user.profileImage }
              : null;
          })
        );

        const selected = await Promise.all(
          post.selectedApplicants.map(async (userId) => {
            const user = await User.findById(userId);
            return user
              ? {
                  id: user._id,
                  username: user.username,
                  profileImage: user.profileImage,
                }
              : null;
          })
        );

        return {
          ...post._doc,
          profileImage: recruiter.profileImage,
          username: recruiter.username,
          likes: likes.filter(Boolean),
          applications: applications.filter(Boolean),
          selections: selected.filter(Boolean),
          blockList: blockList.filter(Boolean),
        };
      })
    );

    // Filter out null values from postsWithRecruiterInfo
    const validPosts = postsWithRecruiterInfo.filter((post) => post !== null).reverse();

    res.send({ success: true, posts: validPosts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Something went wrong!" });
  }
};

const getPostLikes = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      res.send({ success: false, message: "Provide post details!" });
    }
    const response = await Post.findById(postId).then((pst) => {
      return pst.likedBy;
    });
    const finalResponse = (await User.find({})).filter((uss) => {
      if (response.includes(uss.likedPosts)) {
        return { username: uss.username, profileImage: uss.profileImage };
      }
    });
    res.send({ success: true, pdata: finalResponse });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "Something went wrong!" });
  }
};

const viewWhoApplied = async (req, res) => {
  try {
    if (!req.body.postId) {
      res.send({ success: false, message: "Provide post details!" });
    }
    const { postId } = req.body;
    const response = await Post.findById(postId).then((pst) => {
      return pst.appliedBy;
    });
    const finalRespnse = (await User.find({})).filter((uss) => {
      if (response.includes(uss.appliedPosts)) {
        return { username: uss.username, profileImage: uss.profileImage };
      }
    });
    res.send({ success: true, data: finalRespnse });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "Something went wrong!" });
  }
};

const viewProfile = async (req, res) => {
  try {
    if (req.body.viewName) {
      res.send({ success: false, message: "Provide details!!" });
      return;
    } else {
      const r = await Recruiter.findOne({ username: req.body.viewName });
      const u = await User.findOne({ username: req.body.viewName });
      if (r) {
        const response = {
          username: r.username,
          profileImage: r.profileImage,
          about: r.about,
          followers: r.followers.length,
          hiring: r.createdPosts.length,
          location: r.location,
          mobile: r.mobileNumber,
          email: r.mailId,
          insta: r.instagram,
          x: r.twitter,
        };
        res.send({ success: true, data: response });
      } else {
        const response = {
          username: u.username,
          profileImage: u.profileImage,
          about: u.about,
          role: u.category,
          following: u.following.length,
          applied: u.appliedPosts.length,
          selected: u.acceptedPosts.length,
          location: u.location,
          mobile: u.mobileNumber,
          email: u.mailId,
          insta: u.instagram,
          x: u.twitter,
        };
        res.send({ success: true, data: response });
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "Something went wrong!" });
  }
};

async function deleteAccountAndRelatedActivities(req, res) {
  try {
    const userId = req.user.userID;
    const role = req.headers.authorization.split(" ")[0];
    // const user = await User.findById(userId);
    if (role === 'User') {
      await User.findByIdAndDelete(userId);
      await Post.updateMany(
        { _id: { $in: user.likedPosts } },
        { $pull: { likedBy: userId } }
      );
      await Post.updateMany(
        { _id: { $in: user.appliedPosts } },
        { $pull: { appliedBy: userId } }
      );
      await Post.updateMany(
        { _id: { $in: user.acceptedPosts } },
        { $pull: { selectedApplicants: userId } }
      );
      await Application.deleteMany({ appliedBy: userId });
      await Recruiter.updateMany(
        { followers: userId },
        { $pull: { followers: userId } }
      );
      res.send({
        success: true,
        message: "Account deleted successfully!",
      });
      return;
    }
    if (role === 'Recruiter') {
      await Recruiter.findByIdAndDelete(userId);
      const recruiterPosts = await Post.find({ postedBy: userId });
      await Post.deleteMany({ postedBy: userId });
      await User.updateMany(
        {
          $or: [
            { likedPosts: { $in: recruiterPosts.map((post) => post._id) } },
            { appliedPosts: { $in: recruiterPosts.map((post) => post._id) } },
            { acceptedPosts: { $in: recruiterPosts.map((post) => post._id) } },
          ],
        },
        {
          $pull: {
            likedPosts: { $in: recruiterPosts.map((post) => post._id) },
            appliedPosts: { $in: recruiterPosts.map((post) => post._id) },
            acceptedPosts: { $in: recruiterPosts.map((post) => post._id) },
          },
        }
      );
      await Application.deleteMany({ org: recruiter._id });
      await User.updateMany(
        { following: userId },
        { $pull: { following: userId } }
      );
      res.send({
        success: true,
        message: "Account deleted successfully!",
      });
      return;
    }
    res.send({ success: false, message: "User or recruiter not found" });
  } catch (error) {
    res.send({
      success: false,
      message: "Failed to delete account and related activities",
      error,
    });
  }
}

module.exports = {
  getPosts,
  getPostLikes,
  viewWhoApplied,
  viewProfile,
  deleteAccountAndRelatedActivities,
};
