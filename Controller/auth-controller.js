const UserDto = require('../Dtos/ user-dto');
const { use } = require('../Routes');
const hashService = require('../Service/hash-service');
const OtpService = require('../Service/OtpService');
const tokenService = require('../Service/token-service');
const userService = require('../Service/user-service');



class AuthController{
    
    async sendOtp(req,res){
         const { Phone } = req.body;
         console.log(req.body)

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
            console.log(error);
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
                          console.log("Running");
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

                      res.json({ userData , auth:true });
                }
            }
        }

    }

    async refresh(req,res){
      var userData;
      var user;
      try {
         const {refreshToken:refreshTokenFromClient} = req.cookies;
          userData = await tokenService.verifyrefreshToken(refreshTokenFromClient);
         

      } catch (error) {
         res.status(401).json({ msg:"Invalid Token" });
      }

      try {
        const token = await tokenService.findTokenInDb(userData._id,refreshTokenFromClient);
         if(!token){
              res.status(401).json({ msg:"Invalid Token" });
         }
         user = userService.findUser({_id:userData._id})
         if(!user){
          res.status(404).json({msg:"No user Found"});
         }
      } catch (error) {
        res.status(500).json({ msg:"Internal Server Error" });
      }

      const { acessToken ,  refreshToken } = tokenService.generateTokens({ _id:userData._id })

      try {

        await tokenService.updateRefreshToken(user._id,refreshToken);
        
      } catch (error) {
          res.status(500).json({msg:"Internal Server Error"});
      }

      res.cookie(`refreshToken`, refreshToken,{
        maxAge:1000 * 60  * 60 * 24 *30,
        httpOnly:true
      })

      res.cookie(`acessToken`, acessToken,{
        maxAge:1000 * 60  * 60 * 24 *30,
        httpOnly:true
      })

      const uservalues= new UserDto(user);

      res.json({ uservalues , auth:true });
    }
}

module.exports = new AuthController();