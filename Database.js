const mongoose = require('mongoose');

function DBConnection(){
    
    const DB_URL = process.env.DB_URL
    mongoose
    .connect(DB_URL)
    .then(() => console.log('mongoDB connected...'))
    .catch(()=> console.log('mongoDb Connection Failed'));

}

module.exports = DBConnection;