const mongoose = require("mongoose");
const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  voters: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      votedAt: {
        type: String,
        default: Date.now(),
      },
    },
  ],
});

const candidate = mongoose.model("candidate", candidateSchema);
module.exports = candidate;
