const { base } = require("../Model/refresh-token");
const jimp = require('jimp');
const path = require('path');
const User = require('../Model/User');
const UserDto = require('../Dtos/ user-dto');


class activateController{


    async activate(req,res){
        const {name, avatar} = req.body;
        const buffer = Buffer.from(avatar.replace('data:image/jpeg;base64,',''),'base64');

        const imagePath = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}.png`

      try {

        var jimpRes = await jimp.read(buffer);
        jimpRes.resize(150,jimp.AUTO).write(path.resolve(__dirname,`../storage/${imagePath}`))
        
      } catch (error) {
        return res.status(500).json({ msg:"Not able to Compress the image" });
      }

         
        const userId = req.user.id;


        try {
          var user = await User.findById(userId);
         

        if(!user){
          return res.status(200).json({msg:"User not found"});

        }
        else{
         
          user.activated = true;
          user.name = name;
          user.avatar = `/storage/${imagePath}`;
       
          await User.updateOne({_id:userId},user)
          
          return res.status(200).json( {user :new UserDto(user) , auth:true} );
        

        }
        } catch (error) {
          console.log(error);
          return res.status(500).json({ msg:"Something Went Wrong" });

        }


     

           
    }
}

module.exports = new activateController();