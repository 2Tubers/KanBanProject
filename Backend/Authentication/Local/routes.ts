import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import passport from "passport";
import { addNewUser } from "../../Database/index.ts";
import { generatePassword } from "../utils/index.js"

const webAuthRouter = Router();

webAuthRouter.post("/signin", async (req, res) => {
    const { userName, password } = req.body;
    const { saltHex, hashHex } = await generatePassword(password);

    await addNewUser(userName, saltHex, hashHex);

    res.status(201).json({ message: "user successfully created" });
});

webAuthRouter.post("/login", (req, res, next) => {
    passport.authenticate(
        "local",
        (err: Error | null, user: Express.User | false, info: { message?: string }) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    message: info?.message || "Incorrect username or password"
                });
            }

            req.logIn(user, loginError => {
                if (loginError) return next(loginError);
                res.status(200).json({ message: "login successful" });
            });
        }
    )(req, res, next);
});

export function requireWebSession(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ message: "Authentication required" });
}

webAuthRouter.use(requireWebSession);

export default webAuthRouter;