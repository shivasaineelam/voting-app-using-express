const express = require("express");
const userRoutes = require("./Routes/user-routes");
const bodyparser = require("body-parser");
const candidateRoutes = require("./Routes/candidate-route");
const livecount = require("./livecount");
require("./db");
require("dotenv").config();

const app = express();
app.use(bodyparser.json());

app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);
app.use("/livecount", livecount);
app.listen(process.env.PORT || 3000, () => {
  console.log("connected to the server at port 3000");
});
