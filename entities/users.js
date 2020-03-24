'use strict'

module.exports = (mongoose) => {

  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;
  const User = new Schema({
    name: String,
    pass: String,
    email: String,
    phone: Number,
    role: String
  });
  console.log("create User");
  return mongoose.model('Users', User);
}