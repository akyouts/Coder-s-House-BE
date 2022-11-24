class UserDto{
    id;
    phone;
    activated;
    createdAt;
    name;
    avatar;
    
    constructor(data){
        this.id = data._id;
        this.Phone = data.phone;
        this.createdAt = data.createdAt;
        this.name = data.name;
        this.avatar = data.avatar;
        this.activated = data.activated;


    }
    
}

module.exports = UserDto;