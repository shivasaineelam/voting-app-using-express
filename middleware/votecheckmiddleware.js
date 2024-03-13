const jwt = require("jsonwebtoken");
const user = require("../models/user");
const votecheckmiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.send({ error: "unauthorized" }).status(404);
  try {
    const payload = jwt.verify(token, process.env.SECRETKEY);
    const { aadharNumber } = payload;

    const data = await user.find({ aadharNumber: aadharNumber });
    req.data = data[0];
    if (data[0].isvoted) return res.status(400).send("already voted");
    next();
  } catch (err) {
    return res.status(400).send({ error: "invalid token" });
  }
};

module.exports = votecheckmiddleware;
