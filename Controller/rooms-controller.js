const roomService = require('../Service/room-service')

class roomsController{

    async create(req,res){

        const {topic , roomType} =  req.body;

        if(!topic||!roomType){
            return res.status(400).json({ msg:"All fields are Required" });
        }

        const room = await  roomService.create({ 
            topic,
            roomType,
            ownerId:req.user._id||req.user.id
        })

    }
    
}

module.exports = new roomsController();