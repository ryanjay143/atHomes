
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
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg rounded-xl border border-b-4 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center text-sm text-gray-500 mt-1">
            Enter your email to receive a password reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <span className="text-red-500 text-sm">{error}</span>}
            </div>

            <div className="flex flex-col space-y-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
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
                onClick={() => 
                  navigate('/user-login')}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ForgotPassword;
