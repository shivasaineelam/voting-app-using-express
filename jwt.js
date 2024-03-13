const jwt = require("jsonwebtoken");
const jwtauthmiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.send({ error: "unauthorized" }).status(404);
  try {
    const payload = jwt.verify(token, process.env.SECRETKEY);
    req.user = payload;

    next();
  } catch (err) {
    return res.status(400).send({ error: "invalid token" });
  }
};

const adminauthmiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.send({ error: "unauthorized" }).status(404);
  try {
    const payload = jwt.verify(token, process.env.SECRETKEY);
    req.user = payload;
    if (payload.role != "admin")
      return res.status(404).send({ error: "unauthorized" });
    next();
  } catch (err) {
    return res.status(400).send({ error: "invalid token" });
  }
};

const generatetoken = (userdata) => {
  return jwt.sign(userdata, process.env.SECRETKEY);
};

module.exports = { jwtauthmiddleware, generatetoken, adminauthmiddleware };
