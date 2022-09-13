const User = require('../Model/User');
const UserModel = require('../Model/User');

class UserService {

     async findUser(filter){

        const result = await UserModel.findOne(filter);
        return result;
       

     }


     async createUser(data){
          
         const result = await UserModel.create(data);

         return result

       

     }


}

module.exports = new UserService();