const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  aadharNumber: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  isvoted: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(user.password, salt);
    user.password = hashedpassword;
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.checkpassword = async function (givenpassword) {
  try {
    const ismatch = await bcrypt.compare(givenpassword, this.password);
    return ismatch;
  } catch (error) {
    return error;
  }
};
const User = mongoose.model("user", userSchema);
module.exports = User;
