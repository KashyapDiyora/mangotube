"use client"
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FileUpload from "../components/FileUpload";
import { Loader2 } from "lucide-react";
import GoogleButton from "react-google-button";

function Register() {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(""); // Avatar state
  const [coverImage, setCoverImage] = useState(""); // Cover Image state
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const isValidData = () => {
    setError("");
    
    if (!username || !fullname || !email || !password || !avatar || !coverImage) {
      setError("All fields are required.");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const isValid = isValidData();
    if (isValid) {
      try {
        const res = await fetch("/api/auth/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            fullname,
            password,
            avatar,
            coverImage,
            provider: "credentials",
          }),
        });
        const newUser = await res.json();
        if(newUser?.message){
          setError(newUser.message);
        }
        if(newUser?.done){
          router.push("/login");
        }
      } catch (error) {
        console.log("error =>", error.message);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex-col items-center text-black bg-white overflow-x-hidden py-8">
        <div className="text-center text-3xl my-5 text-gray-600">Sign In</div>
        <div className="w-full flex justify-center">
          <GoogleButton onClick={() => signIn("google",{callbackUrl : "/"})} />
        </div>
        <div className="text-center mt-2">OR</div>
        <form className="max-w-full mt-2 px-6 md:px-20 w-full">
          <div className={`w-full flex flex-col justify-center items-center  ${loading ? 'bg-gray-50': 'bg-white'} py-5 shadow border rounded-2xl`}>
            {loading && (
              <div className="w-full flex items-center justify-center gap-2 text-sm text-primary">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>            
            )}
            <div className="text-red-600 text-center">{error}</div>

            <div className="w-full flex flex-col md:flex-row items-center justify-center px-6 mx-auto lg:py-0">
              <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
                <div className="md:px-6 space-y-4 md:space-y-6 sm:p-8">
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
                      Username
                    </label>
                    <input
                      placeholder="JohnDoe"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                      id="username"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      type="text"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fullname"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <input
                      placeholder="JohnDoe Yelov"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                      id="fullname"
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                      type="text"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
                      Email ID
                    </label>
                    <input
                      placeholder="johndoe@xyz.com"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
                <div className="md:px-6 space-y-4 md:space-y-5 sm:p-8">
                  <div>
                    <label
                      htmlFor="avatar"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
                      Avatar
                    </label>
                    <div className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5">
                      <FileUpload
                        fileType="image"
                        onSuccess={(res) => setAvatar(res.url)} 
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="coverImage"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
                      Cover Image
                    </label>
                    <div className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5">
                      <FileUpload
                        fileType="image"
                        onSuccess={(res) => {setCoverImage(res.url);}} // Set cover image URL on success
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-1 text-sm font-medium text-gray-900"
                    >
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
                </div>
              </div>
            </div>

            <button
              className="mt-2 bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-blue-800 text-white"
              type="submit"
              onClick={handleSubmit}
            >
              Create an account
            </button>

            <div className="text-center mt-2">
              Already Have Account?{" "}
              <Link href={"/login"} className="text-gray-700 font-bold">
                Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Register;
