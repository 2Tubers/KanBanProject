import passport from "passport";
import {Strategy as JwtStrategy} from "passport-jwt";
import {ExtractJwt} from "passport-jwt";
import { getUserById } from "../../Database/index.js";
import type { User } from "../../Database/index.js";
import jsonwebtoken from "jsonwebtoken";
import fs from "node:fs";


export function issueJWT(user:User) {
  const _id = user._id;

  const expiresIn = '1d';

  const PRIV_KEY = fs.readFileSync(
    new URL("./id_rsa_priv.pem", import.meta.url)
);
  
  // const PRIV_KEY=fs.readFileSync("id_rsa_priv.pem");

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

// type opt={
//     jwtFromRequest?:string,
//     secretOrKey?:string,
//     issuer?:string,
//     audience?:string
// }
// var opts:opt = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

// passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
//     const id=jwt_payload.sub;

//     try{
//     const result= await getUserById(id);
//     if(result)
//         done(null,result);
//     else
//         done(null,false);

//     }catch(err)
//     {
//         done(err,false);
//     }

// }));