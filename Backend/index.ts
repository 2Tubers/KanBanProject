import express, {type Request, type Response, type NextFunction } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import crypto from "crypto";
import MySQLStoreFactory from "express-mysql-session";
import { getUser,addNewUser,getUserById} from "./Database/index.ts";
import cors from "cors";

const app=express();

const PORT=process.env.PORT || 4000;

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

async function generatePassword(password:string) {
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

async function verifyPassword(password:string, salt:string, originalHashHex:string) {
    return new Promise((resolve, reject) => {
     
            const iterations = 1000;
            const keyLength = 64;      
            const digest = 'sha256';

             const saltBuffer = Buffer.from(salt, 'hex');


        crypto.pbkdf2(password, saltBuffer, iterations, keyLength, digest, (err, hashedKey) => {
            if (err) return reject(err);

            const newHashHex = hashedKey.toString('hex');
       
            const match = crypto.timingSafeEqual(
                Buffer.from(originalHashHex, 'hex'),
                Buffer.from(newHashHex, 'hex')
            );

            console.log(match);

            resolve(match);
        });
    });
}

async function verifyUser(userName:string,password:string,cb:Function){

    const users=await getUser(userName);

    console.log(users);

    if(users.length===0)
        return cb(null, false,{message:'Incorrect username or password'});

      const user = users[0];

      const originalHashedPassword=user?.hashedPassword || "";
      const salt=user?.salt || "";


    const isValidUser=await verifyPassword(password,salt,originalHashedPassword);

       if(!isValidUser)
        return cb(null, false,{message:'Incorrect username or password'});

       return cb(null,user);
}

app.use(session({
    secret: 'your_secure_session_secret',
    resave: false,                       
    saveUninitialized: false,             
    store: sessionStore,               
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,    
        httpOnly: true,                  
        secure: false                  
    }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(passport.initialize());
app.use(passport.authenticate('session'));

passport.use(new LocalStrategy( {
            usernameField: 'userName',
            passwordField: 'password'
        }, verifyUser));

// passport.serializeUser(function(user, cb) {
//   process.nextTick(function() {
//     cb(null, { id: user.id, username: user.username });
//   });
// });

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id:number, done) => {
    const user = await getUserById(id);

    done(null, user);
});

app.post('/signin',async (req,res)=>{
   
     const {userName,password}=req.body;

     const {saltHex,hashHex}= await generatePassword(password);

     await addNewUser(userName,saltHex,hashHex);

     res.status(201).json({ message: 'user successfully created' });
})

app.post('/login',(req,res,next) => {
    passport.authenticate('local', (err:Error | null, user:Express.User | false, info:{message?:string}) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message || 'Incorrect username or password' });

        req.logIn(user, (loginError) => {
            if (loginError) return next(loginError);
            res.status(200).json({ message: 'login successful' });
        });
    })(req,res,next);
});

app.get('/',(req,res)=>{
    res.send(200).send("hi");
})
  

app.use(handleErrors);

function handleErrors(err:Error,req:Request,res:Response,next:NextFunction){
     console.error(err.stack);
    //  next(err)// this will lead to handling of the build in error handler
     res.status(500).send("Something went Wrong, Please try again Later");
}

app.listen(PORT,()=> console.log("server started"));