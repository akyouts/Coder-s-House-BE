const hashService = require('../Service/hash-service');
const OtpService = require('../Service/OtpService');
const userService = require('../Service/user-service');

class AuthController{
    
    async sendOtp(req,res){
         const { Phone } = req.body;

         if(!Phone){
            return res.status(400).json({ msg:"Phone Number Field is Required"  });
         }
         const otp = OtpService.generateOtp();
         const expires = Date.now() + (1000 * 60 * 2);
         const String_for_hashing = `${Phone}.${otp}.${expires}`
         const hash = hashService.generatehash(String(String_for_hashing));


         try {
            await OtpService.sendBySMS(Phone,otp);
         return res.status(200).json({ Phone:Phone ,hash:`${hash}-${expires}` })
         
         } catch (error) {
            console.log(error);
            return res.status(500).json({ msg:"Some thing Went Wrong" })
         }
         
    }

    verifyOtp(req,res){
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
                      let accessToken;
                      let refreshToken;

                      try {

                        user = userService.findUser({ Phone })

                        if(!user){
                            
                        }
                        
                      } catch (error) {
                        
                      }
                }
            }
        }

    }
}

module.exports = new AuthController();