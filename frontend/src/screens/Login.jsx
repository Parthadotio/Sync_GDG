import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "../config/axios";
import { UserContext } from "../context/user.context.jsx";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();

    axios
      .post("/users/login", { email, password })
      .then((res) => {

        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);

        toast.success("Welcome Back", {
          position: "top-right",
          autoClose: 1200,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        setTimeout(() => {
          navigate("/projects");
        }, 1200);
      })
      .catch((err) => {
        console.log(err.response?.data);
        toast.error("Login failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-sm p-6 space-y-6 rounded-lg bg-slate-800">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">Welcome back</h2>
          <p className="mt-2 text-sm">Please sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={submitHandler}>
          <div className="space-y-4">

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg block w-full pl-10 text-black pr-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type={showPassword ? "text" : "password"}
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <ToastContainer 
          position="top-right" 
          autoClose={5000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="dark" 
          transition={Bounce}
           />


          <div>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Login
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-300">
              Don't have an account?{" "}
              <Link to="/register" className="text-white font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
