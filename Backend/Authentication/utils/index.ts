import crypto from "node:crypto";

export async function generatePassword(password:string) {
    return new Promise<{saltHex:string,hashHex:string}>((resolve, reject) => {
        // 1. Generate a 16-byte (128-bit) cryptographically strong random salt
        crypto.randomBytes(16, (err, salt) => {
            if (err) return reject(err);

            const iterations = 1000;
            const keyLength = 64;      
            const digest = 'sha256';

            crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, hashedPassword) => {
                if (err) return reject(err);

                const saltHex = salt.toString('hex');
                const hashHex = hashedPassword.toString('hex');

                resolve({saltHex,hashHex});
            });
        });
    });
}

export async function verifyPassword(password:string, salt:string, originalHashHex:string) {
    return new Promise((resolve, reject) => {
     
            const iterations = 1000;
            const keyLength = 64;      
            const digest = 'sha256';

             const saltBuffer = Buffer.from(salt, 'hex');


        crypto.pbkdf2(password, saltBuffer, iterations, keyLength, digest, (err, hashedKey) => {
            if (err) return reject(err);

            // const newHashHex = hashedKey.toString('hex');
       
            const match = crypto.timingSafeEqual(
                Buffer.from(originalHashHex, 'hex'),
                hashedKey
                // Buffer.from(newHashHex, 'hex')
            );

            resolve(match);
        });
    });
}