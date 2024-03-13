const user = require("./../models/user");
const candidate = require("./../models/candidate");
const router = require("express").Router();
const { generatetoken, jwtauthmiddleware } = require("../jwt");
const votecheckmiddleware = require("./../middleware/votecheckmiddleware");

router.post("/signup", async (req, res) => {
  const data = req.body;
  const newUser = new user(data);
  try {
    const user = await newUser.save();
    const token = generatetoken({
      aadharNumber: user.aadharNumber,
      role: user.role,
      id: user.id,
    });
    res.status(200).send({ data: data, token: token });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { aadharNumber, password } = req.body;
  try {
    const response = await user.findOne({ aadharNumber: aadharNumber });
    if (!response) return res.status(404).send("user not found please sign up");
    const ismatch = await response.checkpassword(password);
    if (ismatch == false) return res.status(404).send("wrong password");
    const token = generatetoken({
      aadharNumber: response.aadharNumber,
      role: response.role,
      id: response.id,
    });
    res.status(200).send({ data: response, token: token });
  } catch (err) {
    res.status(500).send(err);
  }
});
router.post("/vote/:id", votecheckmiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const data = req.data;
    const response = await candidate.findByIdAndUpdate(
      { _id: id },
      { $push: { voters: { user: data.id } } }
    );
    console.log(response);
    await user.findOneAndUpdate(
      { aadharNumber: data.aadharNumber },
      { isvoted: true }
    );
    res.status(200).send("successfully casted the vote");
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
});

router.get("/profile", jwtauthmiddleware, async (req, res) => {
  const { aadharNumber } = req.user;
  try {
    const data = await user.find({ aadharNumber: aadharNumber });
    return res.send(data).status(200);
  } catch (err) {
    return res.send("error occured").status(500);
  }
});
router.put("/profile", jwtauthmiddleware, async (req, res) => {
  const { aadharNumber } = req.user;
  const data = req.body;
  try {
    const response = await user.findOneAndUpdate(
      { aadharNumber: aadharNumber },
      data
    );
    return res.send(response).status(200);
  } catch (err) {
    return res.send("error occured").status(500);
  }
});

module.exports = router;
