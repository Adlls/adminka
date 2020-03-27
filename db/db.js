'use strict';

module.exports = class db {
    _db_connect;
    constructor() {
        this._db_connect = require('../db');
    }

    getMongoose() {
        return this._db_connect.mongoose;
    }

    create (model) {
        model.save((err) => {
            if (err) return console.log(err + "error");
            console.log("save in db");
        });
    }

    remove (model) {
        model.remove((err) => {
            if (err) return console.log(err + "error");
            console.log("remove");
        });
    }

    remove (model, id) {
        model.remove({_id: id}, (err) => {
            if (err) return console.log(err + "error");
            console.log("remove by id - " + id);
        });
    }

    update(id, model, newModel) {
        model.updateOne(model, newModel, (err) => {
            if (err) return console.log(err + "error");
            console.log("udpate from " + model + " to " + newModel);
        });
    }

     getAll(model) {
       return  model.find({}, (err, docs) => {
            if (err) return err;
            return docs;
        });
    }

    getById(model, id) {
        return model.find(this._db_connect.mongoose.Types.ObjectId(id), (err, docs) => {
            if (err) return err + "error";
            return docs;
        });
    }






}