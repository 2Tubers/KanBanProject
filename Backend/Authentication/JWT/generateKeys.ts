import crypto from "node:crypto";
import fs from "node:fs";

function generateKeys()
{

    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096, // bits - standard for RSA keys
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    fs.writeFileSync('id_rsa_pub.pem', keyPair.publicKey); 
    
    fs.writeFileSync('id_rsa_priv.pem', keyPair.privateKey);

}

generateKeys();