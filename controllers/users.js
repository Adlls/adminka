'use strict';

 module.exports = class users {
     _db;
     _d;
     _users;
     static _instance;
     constructor() {
         if (users._instance) {
             throw new Error("Instantiation failed: "+
                 "use getUserDoc() instead of new.");
         }
         users._instance = this;
         this._d = require('../db/db');
         this._db = new this._d();
         this._users = require('../entities/users')(this._db.getMongoose());
     }

     static getUserDoc() {
         if (users._instance) return users._instance;
         return users._instance = new users();
     }

     getAll() {
         return this._db.getAll(this._users);
     }

     getById(id) {
         return this._db.getById(this._users, id);
     }

     update(id, updateDataset) {
        return  this._db.update(id, this._users, updateDataset);
     }

     create (nm) {
         return this._db.create(this._users, nm);
     }

     remove (id) {
         return this._db.remove(this._users, id);
     }
 }
