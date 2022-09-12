const crypto = require('crypto');
require('dotenv').config();

class HashService{

    generatehash(data){
        const hash = crypto.createHash('sha256',process.env.secret || 'secret').update(data).digest('hex');
        return hash;
    }
    hashVerify(){

    }

}

module.exports = new HashService();