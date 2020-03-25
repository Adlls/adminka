'use strict';

 module.exports = class users {
     _db;
     _users;
     constructor() {
         this._db = new require('../db/db');
         var d = require('../db/db');
         this._db = new d();
         this._users = require('../entities/users')(this._db.getMongoose());
     }

     getAll (req, res) {
         this._db.getAll(this._users);
     }

     create (req, res) {
         var user1 = new this._users({name: "kek", pass: "123", email: "ad@r.ru", phone: 1234, role: "admin"});
         this._db.create(user1);
     }
 }
