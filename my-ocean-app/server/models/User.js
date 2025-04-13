const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },  // password may be null for OAuth users
  kakaoId: { type: String }    // store Kakao ID if available
});

module.exports = mongoose.model('User', UserSchema);
