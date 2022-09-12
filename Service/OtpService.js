const crypto = require('crypto');
const hashService = require('./hash-service');
const smsSID = process.env.SMS_SID;
const SMS_AUTH_TOKEN = process.env.SMS_AUTH_TOKEN;
const twilio = require('twilio')(smsSID,SMS_AUTH_TOKEN,{
    lazyLoading:true
})

class OtpService{

    generateOtp(){
        return crypto.randomInt(1000,9999);
    }

    async sendBySMS(Phone,otp){
          return await twilio.messages.create({
            to:Phone,
            from:process.env.SMS_Phone,
            body:`Your Coder's House OTP is ${otp}`
          })
    }

    verifyOtp(data, hash){
        return hashService.generatehash(data) === hash;
    }

}

module.exports = new OtpService();