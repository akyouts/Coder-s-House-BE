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

    async verifyAccessToken(token){
        return jwt.verify(token,accessTokenSecret);
    }

    async verifyrefreshToken(token){
        return jwt.verify(token,refreshTokenSecret);
    }

    async findTokenInDb(UserId,token){
        return await refreshToken.findOne({ _id:UserId , token });
    }

    async updateRefreshToken(userId ,token){
        return await refreshToken.updateOne({ _id:userId },{ token });
    }
    

}

module.exports = new TokenService();