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
}

module.exports = new roomService();