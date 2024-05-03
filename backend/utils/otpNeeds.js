const { Recruiter } = require("../models/recruiterModel");
const { User } = require("../models/userModel");
const { sendMail } = require("./sendMailUtility");

const sendOtp = async (req, res) => {
  try {
    const userId = req.body.email;
    if (!userId) {
      res.send({ success: false, message: "Provide email!" });
      return;
    }
    const task = req.body.need.split(" ")[0];
    const role = req.body.need.split(" ")[1];
    if (task === "fp") {
      const user =
        role === "U"
          ? await User.findOne({ mailId: userId })
          : await Recruiter.findOne({ mailId: userId });
      if (user) {
        const otp = await sendMail(userId);
        if (otp) {
          res.send({ success: true, otp: otp });
          return;
        }
      } else {
        res.send({ success: false, message: "Not registered!" });
        return;
      }
    } else {
      if (task != "su") {
        res.send({ success: false, message: "Provide need!" });
        return;
      }
      const ex1 = await User.findOne({ mailId: userId });
      const ex2 = await Recruiter.findOne({ mailId: userId });
      if (userId && !ex1 && !ex2) {
        const otp = await sendMail(userId);
        if (otp) {
          res.send({ success: true, otp: otp });
          return;
        }
      } else {
        if (userId) {
          res.send({ success: false, message: "Email already registered!" });
          return;
        }
        res.send({ success: false, message: "Please provide email!" });
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "Something went wrong!" });
  }
};

const verifyOtp = (req, res) => {
  try {
    const otpEntered = req.body.otpEntered;
    const otpReceived = req.body.otpReceived;
    if (otpEntered && otpReceived) {
      if (otpEntered === otpReceived) {
        res.send({ success: true, message: "otp verification successfull!" });
      } else {
        res.send({ success: false, message: "Incorrect otp entered!" });
      }
    } else {
      if (otpEntered) {
        res.send({ success: false, message: "otp expired!" });
      } else {
        res.send({ success: false, message: "please enter otp!" });
      }
    }
  } catch (error) {
    res.send({ success: false, message: "something went wrong" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
