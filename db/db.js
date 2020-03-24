'use strict'

  const mongoose = require('mongoose');
  const properties = {
    port: process.env.PORT_DB || 'mongodb://localhost',
    db_host: process.env.HOST_DB || '27017',
    db_name: process.env.DB_NAME || 'adminka'
  };

  function getUrl() {
    return properties.db_host + "/" + properties.db_name;
  }

  (() => {
    mongoose.connect(getUrl(), 
     {
       useNewUrlParser: true,
       useUnifiedTopology: true
     });
     console.log("connect to db on " + getUrl());
   })();

 exports.mongoose = mongoose;


  
