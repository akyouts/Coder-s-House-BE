const tokenService = require("../Service/token-service");

module.exports = async (req,res,next)=>{

    try {

        const { acessToken } = req.cookies
        console.log(acessToken);
        if(!acessToken){
            throw new Error();
        }

        const userData = await tokenService.verifyAccessToken(acessToken);
        req.user = userData
        console.log(userData);
        next();
    
        
    } catch (error) {
        res.status(401).json({ msg:"Invalid Access Token" })
    }


    
    
}