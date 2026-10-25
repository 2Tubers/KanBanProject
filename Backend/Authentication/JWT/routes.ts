import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { addNewUser, getUser } from "../../Database/index.ts";
import { generatePassword,verifyPassword } from "../utils/index.js";
import { issueJWT } from "./configure.js";


const mobileRouter = Router();

mobileRouter.post("/signin", async (req, res) => {
    const { userName, password } = req.body;
    const { saltHex, hashHex } = await generatePassword(password);
    console.log(userName,password);

    await addNewUser(userName, saltHex, hashHex);



    res.status(201).json({ message: "user successfully created" });
});

mobileRouter.post("/login", async(req, res, next) => {
    const {userName,password}=req.body;

    try
    {
        const userdb= await getUser(userName);
        const user=userdb[0];

        if (!user) 
            {
                return res.status(401).json({ success: false, msg: "could not find user" });
            }
        
        const isValid = await verifyPassword(password, user.salt,user.hashedPassword);

        if(isValid)
            {
              const tokenObject = issueJWT(user);
              res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
            } 
            else 
                {
                res.status(401).json({ success: false, msg: "could not find user" });
                }
    }catch(err)
    {
        next(err);
    }
});


// export function requireMobileSession(req: Request, res: Response, next: NextFunction) {
//     passport.authenticate('jwt', { session: false }),
  

//     return res.status(401).json({ message: "Authentication required" });
// }

mobileRouter.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!"});
});

// mobileAuthRouter.use(requireMobileSession);

export default mobileRouter;