const mongoose = require('mongoose');

const User = mongoose.Schema({
    Phone:{ type:String , required:true },
    activated:{ type:Boolean , required:true , default:false },
    name:{ type:String ,default:null },
    avatar:{ type:String, default:null , get:(avatar)=>{
        return `${process.env.BASE_URL}${avatar}`
    } }


},{
    timeStamp:true,
    toJSON:{ getters:true }
})

module.exports = mongoose.model('User',User)