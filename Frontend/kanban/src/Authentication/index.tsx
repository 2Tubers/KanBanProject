import {useState} from "react";
import { useSignin ,useLogin} from "./queries.ts";
import "./styles.css"


export default function LandingPage(){
    const mutation=useSignin();
    const loginMutation=useLogin();
    const[showSignup,setShowSignup]=useState(false);

    const handleSubmit=(e: React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
          console.log("in hanle signin")
        
        const form=e.target;
        const formData=new FormData(form);

        const username=formData.get("username") as string;
        const password=formData.get("password") as string;

        mutation.mutate({userName:username, password:password});
    }

    const handleLogin=(e:React.SubmitEvent<HTMLFormElement>)=>{
        e.preventDefault();
        console.log("in hanle login")

        const form=e.target;
         const formData=new FormData(form);

        const username=formData.get("username") as string;
        const password=formData.get("password") as string;

        loginMutation.mutate({userName:username, password:password});

    }

    const subtitleText=showSignup?"Sign up to start managing your tasks!":"Login in to start managing your tasks!";
    const buttonText=showSignup?"Sign Up":"Login";
    const toggleText=showSignup?"Go Back" :"Sign Up!";

    return (
        <div className="container">

            <div className="header">
                <h1 className="header-brand">TaskForge</h1>
               <p className="header-text">{!showSignup ? "Don't Have an account?" : ""} <button onClick={() => setShowSignup((prev) => !prev)} className="signup-link">{toggleText}</button></p>
            </div>

            <div className="separator"/>

            <div className="body-container">
            <img src="./images/TaskForge.png" alt="TaskForge" className="landing-image" />

            <div className="login-container">
                <p className="heading"> Welcome to TaskForge</p>
                <p className="subtitle">{subtitleText}</p>

                    <form onSubmit={showSignup?handleSubmit:handleLogin} className="form-container">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Username</label> 
                            <input type="text" id="username" name="username" className="inputBox"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" id="password" name="password" className="inputBox"/>
                        </div>

                        <button type="submit" className="primaryBtn">{buttonText}</button>
                    </form>


                {!showSignup &&
                    (
                    <>
                        <div className="content">
                        <p className="otherOption">Or Login with</p>
                        </div>

                        <div className="loginBtnContainer">
                            <button type="button" className="loginBtn" aria-label="Continue with Google">
                                <img src="/svg/google-color-svgrepo-com.svg" alt="Google" className="socialIcon" />
                            </button>
                            <button type="button" className="loginBtn" aria-label="Continue with Apple">
                                <img src="/svg/apple-svgrepo-com.svg" alt="Apple" className="socialIcon" />
                            </button>
                        </div>
                    </>
                    )
                }


            </div>
            </div>

        </div>

    )
}