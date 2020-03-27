'use strict';

module.exports = (mongoose) => {

  const Schema = mongoose.Schema;
  const ObjectId = Schema.ObjectId;

  var User = new Schema({
    name: String,
    pass: String,
    email: String,
    phone: Number,
    role: String
  });
  return mongoose.model('Users', User);

}