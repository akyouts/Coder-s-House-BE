const User = require('../Model/User');
const UserModel = require('../Model/User');

class UserService {

     async findUser(filter){

        UserModel.findOne(filter).then((res)=>{
            return res
        }).catch((error)=>{
            throw new Error("Enable to Access Data Base");
        });

     }

}

module.exports = new UserService();