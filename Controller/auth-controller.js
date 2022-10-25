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

                      res.json({ user , auth:true });
                }
            }
        }

    }
}

module.exports = new AuthController();