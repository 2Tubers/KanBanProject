
import crypto from "crypto";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUser,getUserById} from "../../Database/index.ts";
import { verifyPassword } from "../utils/index.js";



export function configureLocalAuth() {
    passport.use(new LocalStrategy(
        {
            usernameField: "userName",
            passwordField: "password"
        },
        (userName, password, done) => {
            void (async () => {
                try {
                    const users = await getUser(userName);
                    const user = users[0];

                    if (!user) {
                        done(null, false, { message: "Incorrect username or password" });
                        return;
                    }

                    const isValidUser = await verifyPassword(
                        password,
                        user.salt,
                        user.hashedPassword
                    );

                    if (!isValidUser) {
                        done(null, false, { message: "Incorrect username or password" });
                        return;
                    }

                    done(null, user);
                } catch (error) {
                    done(error);
                }
            })();
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id: number, done) => {
        void getUserById(id).then(
            user => done(null, user),
            error => done(error)
        );
    });
}
