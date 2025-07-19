import { CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faSignIn
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faViber
} from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/plugin/axios';
import Swal from "sweetalert2";
import { storeToken } from '@/sanctum/Token';

interface LoginFormInputs {
  credential: string;
  password: string;
}

interface User {
  role: number;
  [key: string]: any;
}

const ROLES = {
  ADMIN: 0,
  AGENT: 1,
  BROKER: 2
} as const;

const ROUTES = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.AGENT]: '/agent-broker/user-dashboard',
  [ROLES.BROKER]: '/broker/broker-dashboard'
} as const;

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormInputs>();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const handleUserNavigation = (user: User) => {
    const userRole = user.role;
    localStorage.setItem("role", String(userRole));

    const targetRoute = ROUTES[userRole as keyof typeof ROUTES];
    if (targetRoute) {
      navigate(targetRoute);
    } else {
      console.error("Unknown user role:", userRole);
    }
  };

  const handleLogin = async (data: LoginFormInputs) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post('login', data);
      const { access_token: access_token, user } = response.data;

      // Store authentication data
      storeToken(access_token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // Show success message and navigate immediately
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1000,
        iconColor: '#16a34a',
        didOpen: () => {
          // Navigate immediately while the success message is showing
          handleUserNavigation(user);
        }
      });

    } catch (error: any) {
      console.error("Login failed", error);

      // Handle specific error responses
      if (error.response?.status === 403) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Opps!",
          text: error.response?.data?.message,
          showConfirmButton: false,
          showCloseButton: true,
        });
      } else {
        const errorMessage = error.response?.data?.message || 'An error occurred during login';
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Login Failed",
          text: errorMessage,
          showConfirmButton: true,
          customClass: {
            confirmButton: 'bg-primary',
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-100 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Glassmorphism Card */}
      <div className="backdrop-blur-lg md:w-[90%] bg-white/50 border border-white/30 shadow-2xl rounded-2xl px-8 py-10 w-full max-w-md mx-auto animate-fade-in-up">
        <CardHeader>
          <Link to="/" className="flex justify-center">
            <img src="./athomes.png" alt="logo" className="w-44 h-32 drop-shadow-lg" />
          </Link>
        </CardHeader>

        <form className="p-2" onSubmit={handleSubmit(handleLogin)}>
          {/* Email/Username Field */}
          <div className="mb-6">
            <label htmlFor="credential" className="block text-sm font-semibold text-blue-900 mb-1">
              Email or Username
            </label>
            <div className="relative">
              <Input
                type="text"
                id="credential"
                placeholder="Enter your email or username"
                {...register("credential", { required: "Email or username is required" })}
                className={`pr-10 bg-blue-50/80 h-12 rounded-lg border-2 focus:border-blue-400 transition-all duration-200 ${errors.credential ? 'border-red-500' : 'border-transparent'}`}
              />
              <FontAwesomeIcon
                icon={faSignIn}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300"
              />
            </div>
            {errors.credential && (
              <p className="text-red-500 text-xs mt-1">{errors.credential.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-blue-900 mb-1">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className={`pr-10 bg-blue-50/80 h-12 rounded-lg border-2 focus:border-blue-400 transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-transparent'}`}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-300 hover:text-blue-500 transition-colors"
                onClick={togglePasswordVisibility}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-2 justify-center mb-4">
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Logging in...</span>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignIn} />
                  <span>Login</span>
                </>
              )}
            </Button>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end mb-2">
            <Link
              to="/forgot-password"
              className={`text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200 font-medium${loading ? ' pointer-events-none opacity-50' : ''}`}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Register Link */}
          <div className="flex justify-center mt-6">
            <p className="text-sm text-blue-900 font-semibold">
              Don't have an account?
              <Link
                to="/user-register"
                className={`text-blue-500 hover:text-blue-700 ml-1 transition-colors duration-200 font-bold${loading ? ' pointer-events-none opacity-50' : ''}`}
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="flex flex-col items-center mt-10">
        <div className="w-40 border-t border-blue-200 my-4" />
        <div className="text-center text-base text-white font-medium">
          Developed by: Ryan Reyes
        </div>
        <div className="flex flex-row gap-4 mt-3">
          {[
            { icon: faFacebook, href: "https://www.facebook.com/ryanjaytagolimotreyes", color: "text-blue-600" },
            { icon: faInstagram, href: "https://www.instagram.com/rah_yan143", color: "text-pink-500" },
            { icon: faViber, href: "https://www.viber.com", color: "text-purple-600" }
          ].map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-300 hover:scale-125"
            >
              <FontAwesomeIcon
                icon={social.icon}
                className={`${social.color} text-3xl drop-shadow-md`}
              />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Login;