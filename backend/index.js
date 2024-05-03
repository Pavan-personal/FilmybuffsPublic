const { Recruiter } = require("./models/recruiterModel");
const { openRoute } = require("./routes/openRoute");
const { recruiterRoute } = require("./routes/recruiterRoute");
const { userRoute } = require("./routes/userRoute");
const { connectToCloudinary } = require("./utils/cloudinary");
const { connectDB } = require("./utils/connectDB");

const app = require("express")();
app.use(require("cors")());
require("dotenv").config({ path: "./.env" });

app.use(require("body-parser").json());
app.use(require("express").json());
app.use(
  require("express-fileupload")({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/", (req, res) => {
  res.send("Mini project");
});

connectDB();
connectToCloudinary();

app.use("/recruiter", recruiterRoute);
app.use("/user", userRoute);
app.use("/open", openRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log("server running on port", process.env.PORT || 3000);
});
