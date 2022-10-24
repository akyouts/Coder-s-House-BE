const mongoose = require('mongoose');

function DBConnection(){
    
    const DB_URL = process.env.DB_URL
    mongoose
    .connect(DB_URL)
    .then(() => console.log('mongoDB connected...'))
    .catch((e)=> console.log('mongoDb Connection Failed',e));

}

module.exports = DBConnection;