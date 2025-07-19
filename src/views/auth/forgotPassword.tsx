import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../plugin/axios";
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (loading) return;
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const response = await axios.post("forgot-password", { email });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Success",
        text: response.data.status,
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
      });

      setEmail('');
    } catch (error) {
      console.error("Error sending reset link:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Oops!",
        text:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "An error occurred. Please try again.",
        showConfirmButton: false,
        showCloseButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-400 to-blue-800 animate-gradient-x">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none ">
        <div className="absolute top-0  left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-blue-400 via-purple-300 to-pink-200 opacity-10 rounded-full blur-2xl animate-spin-slow" />
      </div>

      <Card className="w-full max-w-md md:w-[90%] shadow-2xl rounded-2xl border border-white/30 backdrop-blur-lg bg-white/20 z-10 animate-fade-in-up transition-all duration-700 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:border-blue-300/60">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-600/80 rounded-full p-4 shadow-lg mb-2">
              <FontAwesomeIcon icon={faLock} className="text-white text-3xl" />
            </div>
            <CardTitle className="text-3xl font-bold text-center text-blue-100 drop-shadow-lg">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center text-base text-blue-100 mt-1">
              Enter your email to receive a password reset link.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <Label className="text-blue-100" htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-blue-50/80 h-12 rounded-lg border-2 focus:border-blue-400 transition-all duration-200"
              />
              {error && <span className="text-red-500 text-sm">{error}</span>}
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <>
                    <span>Sending...</span>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </>
                ) : (
                  <span>Send Password Reset Link</span>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-red-500 hover:bg-red-400 text-white hover:text-white"
                disabled={loading}
                onClick={() => navigate('/user-login')}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 10s ease-in-out infinite;
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(.39,.575,.565,1) both;
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .animate-spin-slow {
            animation: spin-slow 18s linear infinite;
          }
        `}
      </style>
    </div>
  );
}

export default ForgotPassword;