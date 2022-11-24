const Room = require('../Model/Room');

class roomService{
    async create(payload){
        const { 
            topic,
            roomType,
            ownerId,
            speaker
        } = payload;
        
        const result = await Room.create({ topic , roomType, ownerId, speaker })
         
        return result;

    }

    async getAllRooms(roomType){
         return await Room.find({ roomType:{ $in:roomType } }).populate('speaker').populate('ownerId').exec();
    }
}

module.exports = new roomService();