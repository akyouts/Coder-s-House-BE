const roomService = require('../Service/room-service')
const roomDto = require('../Dtos/room-dto');

class roomsController{

    async create(req,res){

        const {topic , roomType} =  req.body;

        if(!topic||!roomType){
            return res.status(400).json({ msg:"All fields are Required" });
        }

        const room = await  roomService.create({ 
            topic,
            roomType,
            ownerId:req.user._id||req.user.id,
            speaker:[req.user._id||req.user.id]
        })
        const roomRes = new roomDto(room);
        return res.status(200).json(roomRes)

        

    }
    
}

module.exports = new roomsController();