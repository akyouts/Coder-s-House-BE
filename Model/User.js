const mongoose = require('mongoose');

const User = mongoose.Schema({
    Phone:{ type:String , required:true },
    activated:{ type:Boolean , required:true , default:false }

},{
    timeStamp:true
})

module.exports = mongoose.model('User',User)