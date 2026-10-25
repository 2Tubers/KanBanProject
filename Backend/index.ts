import express, {type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";
import { configureLocalAuth } from "./Authentication/Local/configure.ts";
import webAuthRouter from "./Authentication/Local/routes.ts";
import mobileRouter from "./Authentication/JWT/routes.js";
import cors from "cors";

const app=express();

const PORT=4000;

const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Messi@15086',
    database: 'KanBan',
    createDatabaseTable: true 
};

const MySQLStore = MySQLStoreFactory(session);
const sessionStore = new MySQLStore(dbOptions);

app.use(cors({ origin: 'http://localhost:3000', credentials:true })); 

configureLocalAuth();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api/web',
    session({
        secret: 'your_secure_session_secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false
        }
    }),
    passport.initialize(),
    passport.authenticate('session'),
    webAuthRouter
);

app.use('/api/mobile',mobileRouter)

app.get("/", (req, res) => {
    res.send("Backend is working!");
});
  

app.use(handleErrors);

function handleErrors(err:Error,req:Request,res:Response,next:NextFunction){
     console.error(err.stack);
    //  next(err)// this will lead to handling of the build in error handler
     res.status(500).send("Something went Wrong, Please try again Later");
}

app.listen(PORT,()=>  console.log(`Server started on port ${PORT}`));