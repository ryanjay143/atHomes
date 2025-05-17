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
  [ROLES.ADMIN]: '/athomes/admin',
  [ROLES.AGENT]: '/athomes/agent-broker/user-dashboard',
  [ROLES.BROKER]: '/athomes/agent-broker/user-dashboard'
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
    <div className='lg:mt-36 lg:h-10 xs:mt-80 slg:mt-96 flex items-center flex-col justify-center w-screen h-screen'>
      <div className='sm:absolute lg:w-96 lg:absolute xs:w-80 xs:mr-1 2xl:absolute 2xl:mt-0 2xl:mb-24 lg:mt-48 fade-in-left w-96 rounded-lg'>
        <CardHeader>
          <Link to="/" className="flex justify-center">
            <img src="./athomes.png" alt="logo" className="w-56 h-40" />
          </Link>
        </CardHeader>

        <form className='p-5' onSubmit={handleSubmit(handleLogin)}>
          {/* Email/Username Field */}
          <div className='mb-5'>
            <label htmlFor='credential' className='block text-sm font-medium text-gray-700'>
              Email or username
            </label>
            <Input
              type='text'
              id='credential'
              placeholder='Enter your email or username'
              {...register("credential", { required: "Email or username is required" })}
              className={`pr-10 bg-[#eff6ff] h-12${errors.credential ? 'border-red-500' : ''}`}
            />
            {errors.credential && (
              <p className="text-red-500 text-sm">{errors.credential.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className='mb-5'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='relative'>
              <Input
                type={showPassword ? "text" : "password"}
                id='password'
                placeholder='Enter your password'
                {...register("password", { required: "Password is required" })}
                className={`pr-10 bg-[#eff6ff] h-12${errors.password ? 'border-red-500' : ''}`}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#93c5fd]"
                onClick={togglePasswordVisibility}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className='flex items-center gap-2 justify-center'>
            <Button 
              type="submit" 
              className="text-white w-full flex items-center justify-center gap-2 bg-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Logging in...</span>
                  <span className="animate-spin cursor-not-allowed border-2 border-white border-t-transparent rounded-full w-4 h-4" />
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
          <div className='flex justify-end'>
            <Link 
              to="/athomes/forgot-password" 
              className='text-sm text-primary hover:text-primary-dark'
            >
              Forgot Password?
            </Link>
          </div>

          {/* Register Link */}
          <div className='flex justify-center mt-8'>
            <p className='text-sm text-gray-600 font-semibold'>
              Don't have an account?
              <Link 
                to="/athomes/user-register" 
                className='text-primary hover:text-primary-dark ml-1'
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className='flex flex-col items-center mt-[40%] md:mt-[150%]'>
        <div className='text-center text-base'>
          Developed by: Ryan Reyes
        </div>
        <div className='flex flex-row gap-2 mt-2'>
          {[
            { icon: faFacebook, href: "https://www.facebook.com/ryanjaytagolimotreyes", color: "text-blue-600" },
            { icon: faInstagram, href: "https://www.instagram.com/rah_yan143", color: "text-red-600" },
            { icon: faViber, href: "https://www.viber.com", color: "text-purple-600" }
          ].map((social, index) => (
            <a 
              key={index}
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon 
                icon={social.icon} 
                className={`${social.color} text-3xl transform transition-transform duration-300 hover:scale-125`} 
              />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Login;