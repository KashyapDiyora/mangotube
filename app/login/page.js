"use client"
import React, { useState } from 'react'
import GoogleButton from 'react-google-button';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const isValid = () => {
    if(!email || !password || !validateEmail(email) || !validatePassword(password)){
      return false;
    }
    return true;
  }

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(isValid()){
      const result = await signIn("credentials",{
        email,
        password,
        redirect : false,
      })
      if(result?.error){
        setError(`${result.error}`);
      }
      else{
        router.push("/")
      }
    }
    else{
      setError("You made some mistake please fill write information")
    }
  }

  return (
    <div className='w-screen h-screen py-7 sm:py-6 overflow-x-hidden overflow-y-scroll'>
      {loading && (
        <div className="w-full flex items-center justify-center text-sm text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>            
      )}
      <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full mt-10 mb-10 flex justify-center">
        <GoogleButton onClick={() => signIn("google",{callbackUrl : "/"})} />
      </div>
      <form className="w-full">
        <div className="flex items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <p className="text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl lg:text-3xl">
                Login
              </p>
              <p>
                {error}
              </p>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Email ID
                </label>
                <input
                  placeholder="johndoe@xyz.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Password
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                />
              </div>

              <button
                className="w-full bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  focus:ring-blue-800 text-white"
                type="submit"
                onClick={handleSubmit}
              >
                Sign In
              </button>

              <div className="text-center">
                Now yet Register ? <Link href={'/register'} className="text-gray-700 font-bold" >Register</Link>
              </div>
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}

export default Login;