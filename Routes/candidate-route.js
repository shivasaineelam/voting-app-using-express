const candidate = require("./../models/candidate");
const router = require("express").Router();
const { adminauthmiddleware } = require("../jwt");

router.post("/", adminauthmiddleware, async (req, res) => {
  const data = req.body;
  const newCandidate = new candidate(data);
  try {
    const candidate = await newCandidate.save();
    return res.status(200).send(candidate);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
