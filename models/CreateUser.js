const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  pnumber: String,
  cname: String,
  pic: String
});

module.exports = mongoose.model("Users", UserSchema);
