const crypto = require('crypto');

const EncryptUtil = {
    encrypt(key, content) {
        try {
            const cryptoKey = crypto.createHash('sha256').update(key).digest();
    
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes256', cryptoKey, iv);
            const encryptedJson = cipher.update(content, 'utf8', 'base64') + cipher.final('base64');
            return iv.toString('hex') + encryptedJson;
        } catch(e) {
            console.log(`encrypt err: ${e}, key: ${key}, content: ${content}`);
        }
    },
    decrypt(key, content) {
        try {
            const cryptoKey = crypto.createHash('sha256').update(key).digest();
        
            const iv = new Buffer(content.substring(0,32), 'hex');   
            const encryptedJson = content.substring(32); 
            const decipher = crypto.createDecipheriv('aes256', cryptoKey, iv);
        
            return decipher.update(encryptedJson, 'base64', 'utf8') + decipher.final('utf8');
        } catch(e) {
            console.log(`decrypt err: ${e}, key: ${key}, content: ${content}`);
        }
    }
};

module.exports = EncryptUtil;