const UserDto = require('../Dtos/ user-dto');
const { use } = require('../Routes');
const hashService = require('../Service/hash-service');
const OtpService = require('../Service/OtpService');
const tokenService = require('../Service/token-service');
const userService = require('../Service/user-service');



class AuthController{
    
    async sendOtp(req,res){
         const { Phone } = req.body;
         

         if(!Phone){
            return res.status(400).json({ msg:"Phone Number Field is Required"  });
         }
         const otp = OtpService.generateOtp();
         const expires = Date.now() + (1000 * 60 * 60);
         const String_for_hashing = `${Phone}.${otp}.${expires}`
         const hash = hashService.generatehash(String(String_for_hashing));


         try {
            // await OtpService.sendBySMS(Phone,otp);
         return res.status(200).json({Otp:otp, Phone:Phone ,hash:`${hash}-${expires}` })
         
         } catch (error) {
            
            return res.status(500).json({ msg:"Some thing Went Wrong" })
         }
         
    }

    async verifyOtp(req,res){
        const { Phone , Otp , Hash } = req.body;
        if(!Phone || !Otp || !Hash){
            return res.json(400).json({ msg:"Required Feilds are missing" });
        }
        else{
            const [hashValue,expire] = Hash.split('-');
            if(Date.now() > expire){
                return res.status(400).json({ msg:"OTP Expires" });
            }
            else{
                const String_for_hashing = `${Phone}.${Otp}.${expire}`;
                const isValid  = OtpService.verifyOtp(String_for_hashing,hashValue);
                if(!isValid){
                    return res.status(400).json({ msg:" Invalid OTP " })
                }
                else{
                      let user;
                      

                      try {

                        user = await userService.findUser({ Phone })
                          
                        if(!user){
                          
                          user = await userService.createUser({ Phone });
                        }
                        
                      } catch (error) {
                        
                         return res.status(500).json({ msg:"Some thing Went Wrong" })
                      }


                      // Generate Token
                      const { acessToken , refreshToken } = tokenService.generateTokens({id:user._id, activated:user.activated});
                      await tokenService.storeRefreshToken(refreshToken,user._id)

                      res.cookie(`refreshToken`, refreshToken,{
                        maxAge:1000 * 60  * 60 * 24 *30,
                        httpOnly:true
                      })

                      res.cookie(`acessToken`, acessToken,{
                        maxAge:1000 * 60  * 60 * 24 *30,
                        httpOnly:true
                      })

                      const userData = new UserDto(user);

                      res.json({ user:userData , auth:true });
                }
            }
        }

    }

    async refresh(req,res){
      var userData;
      var user;
      var newAcessToken , newRefreshToken;
      const {refreshToken:refreshTokenFromClient} = req.cookies;
      
      try {
         
          userData = await tokenService.verifyrefreshToken(refreshTokenFromClient);
     

      } catch (error) {
         return res.status(401).json({ msg:"Invalid Token 1" });
      }

      try {
        
        
        const token = await tokenService.findTokenInDb(userData.id?userData.id:userData._id,refreshTokenFromClient);
           
         if(!token){
              return res.status(401).json({ msg:"Invalid Token 2" });
         }
         user = await userService.findUser({_id:userData.id?userData.id:userData._id})
         if(!user){
          return res.status(404).json({msg:"No user Found"});
         }
      } catch (error) {
        return res.status(500).json({ msg:"Internal Server Error 1" });
      }

      const { acessToken ,  refreshToken } = tokenService.generateTokens({id:userData.id?userData.id:userData._id , activated:userData.activated })
      newAcessToken = acessToken,
      newRefreshToken = refreshToken;
      
      try {
        
        await tokenService.updateRefreshToken(user._id,refreshToken);
        
      } catch (error) {
          return res.status(500).json({msg:"Internal Server Error"});
      }
       

      res.cookie(`refreshToken`, newRefreshToken,{
        maxAge:1000 * 60  * 60 * 24 *30,
        httpOnly:true
      })

      res.cookie(`acessToken`, newAcessToken,{
        maxAge:1000 * 60  * 60 * 24 *30,
        httpOnly:true
      })

      const uservalues= new UserDto(user);

      res.status(200).json({ user:uservalues , auth:true });
     }

     async logout(req,res){

      try {
        await tokenService.deleteTokenFromDb(req.cookies.refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('acessToken');
        return res.status(200).json({ user:null , auth:false })
        
      } catch (error) {
        return res.status(500).json('Internal Server Error')
      }
      

     }
}

module.exports = new AuthController();