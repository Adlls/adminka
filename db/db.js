'use strict';

module.exports = class db {
    _db_connect;
    constructor() {
        this._db_connect = require('../db');
    }

    getMongoose() {
        return this._db_connect.mongoose;
    }

    async create (model, nm) {
        await model.create(nm, (err, docs) => {
            if (err) return err + "error";
            return docs;
        });
    }

    remove (model, id) {
      return model.deleteOne({_id: this._db_connect.mongoose.Types.ObjectId(id) }, (err, result) => {
            if (err) return err + "error";
            return result;
        });
    }

    update(id, model, updateDataset) {
        return model.findByIdAndUpdate(id, updateDataset, (err, docs) => {
            if (err) return err + "error";
            return docs;
        });
    }

     getAll(model) {
       return model.find({}, (err, docs) => {
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