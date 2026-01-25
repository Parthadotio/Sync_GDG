import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "../config/axios";
import { UserContext } from "../context/user.context.jsx";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();

    axios
      .post("/users/register", {
        userName,
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  const handleRegister = () => {
    toast.success("Registration Successful. Please login", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
    
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm p-6 space-y-6 rounded-lg bg-slate-800">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">
            Welcome To Sync
          </h2>
          <p className="mt-2 text-sm text-white">Create your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={submitHandler}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-white"
              >
                User name
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-user-line h-5 w-5 text-gray-400"></i>
                </div>
                <input
                  onChange={(e) => setUserName(e.target.value)}
                  id="userName"
                  name="userName"
                  type="text"
                  required
                  className="appearance-none rounded-lg block w-full text-black pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your user name"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg block w-full pl-10 pr-3 py-2 border text-black border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-lg block w-full pl-10 pr-10 py-2 border text-black border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </a>
          </div>

          {/* Submit Button */}
          <div>
            <button
              onClick={handleRegister}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Register
            </button>
          </div>

          {/* For toast message */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <Link to="/" className="text-white hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
