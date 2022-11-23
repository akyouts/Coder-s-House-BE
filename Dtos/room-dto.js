class roomDto {
    id;
    topic;
    roomType;
    ownerId;
    speaker;
    createdAt;

    constructor(room){
        this.id = room.id;
        this.topic = room.topic;
        this.roomType = room.roomType;
        this.ownerId = room.ownerId;
        this.speaker = room.speaker;
        this.createdAt = room.createdAt;

    }

}

module.exports = roomDto