'use strict';

module.exports = (mongoose) => {

  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;

  var User = new Schema({
    name: String,
    login: String,
    pass: String,
    email: String,
    phone: String,
    role: String,
    token: String
  });
  return mongoose.model('Users', User);

}