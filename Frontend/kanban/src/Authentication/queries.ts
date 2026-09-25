// all the authentication query will go here
// only export the custom hooks that will be used in the components

import {useMutation} from "@tanstack/react-query";

type newUserData={
    userName:string,
    password:string,
}

async function addNewUser(data:newUserData){
  const response = await fetch('http://localhost:4000/signin',{
    method:'POST',
    headers: {
      "Content-Type": "application/json",
    },
   credentials: "include",
    body:JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Unable to create account");
}

async function handleLogin(data:newUserData){
   const response = await fetch('http://localhost:4000/login',{
    method:'POST',
    headers: {
      "Content-Type": "application/json",
    },
   credentials: "include",
    body:JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Incorrect username or password");

}

export const useSignin=()=>{
  return useMutation({
    mutationFn:addNewUser,
    onSuccess:()=>{
        console.log("user added succesfully");
    }
  })
}

export const useLogin=()=>{
    return useMutation({
        mutationFn: handleLogin,
    });
}
