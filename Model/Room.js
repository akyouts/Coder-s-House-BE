const mongoose = require('mongoose');

const Room = mongoose.Schema({
    roomType:{ type:String , required:true },
    ownerId:{ type:mongoose.Schema.Types.ObjectId , ref:'User' , required:true },
    speaker:[{ 
        type:mongoose.Schema.Types.ObjectId , ref:'User'
     }],
     topic:{ type:String , required:true  }

},{
    timeStamp:true
})

module.exports = mongoose.model('Room',Room)