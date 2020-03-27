'use strict';

 module.exports = class users {
     _db;
     _users;

     constructor() {
         var d = require('../db/db');
         this._db = new d();
         this._users = require('../entities/users')(this._db.getMongoose());
     }

     async getAll() {
         return this._db.getAll(this._users);
     }

     getById(id) {
         //console.log(this._db.getById(this._users, id));
         return this._db.getById(this._users, id);
     }


     update(id, newModel) {
         let old_model = this.getById(id);
         this._db.update(id, old_model, newModel);
     }

     create (name, pass, email, phone, role) {
         let createUser = new this._users({
             name: name,
             pass: pass,
             email: email,
             phone: phone,
             role: role });
         this._db.create(createUser);
     }

     remove(id) {
         this._db.remove(id, this._users);
     }
 }
