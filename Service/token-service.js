const jwt=require('jsonwebtoken');
const refreshToken = require('../Model/refresh-token');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class TokenService{

    generateTokens(payload){
        const acessToken = jwt.sign(payload, accessTokenSecret , {
            expiresIn:"24h"
        })

        const refreshToken = jwt.sign(payload,refreshTokenSecret,{
            expiresIn:'1y' 
        })

        return { acessToken ,  refreshToken }
    }

    async storeRefreshToken(token,UserId){

        try {
            await refreshToken.create({
                token,
                UserId
            }); 
        } catch (error) {
            
            resizeBy.status(500).json({msg:"Something Went Wrong"})
          
            
        }

    }


    

}

module.exports = new TokenService();