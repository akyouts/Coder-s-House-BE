const mongoose = require('mongoose');

const refreshToken = mongoose.Schema({
    token:{ type:String , required:true },
    UserId:{ type: mongoose.Schema.Types.ObjectId , ref:'User' }

},{
    timeStamp:true
})

module.exports = mongoose.model('refreshToken',refreshToken)