const router = require("express").Router();
const candidate = require("./models/candidate");
router.get("/", async (req, res) => {
  const candidates = await candidate.find();
  const candidatesWithCounts = candidates.map((candidate) => ({
    name: candidate.name,
    voterCount: candidate.voters.length,
  }));

  candidatesWithCounts.sort((a, b) => b.voterCount - a.voterCount);

  res.send(candidatesWithCounts).status(200);
});
module.exports = router;
