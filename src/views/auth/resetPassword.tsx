import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import axios from "../../plugin/axios"
import Swal from "sweetalert2"
import { useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash, faKey } from "@fortawesome/free-solid-svg-icons"

function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [token, setToken] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [resetSuccess, setResetSuccess] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Auto-fill token and email from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const urlToken = params.get("token")
    const urlEmail = params.get("email")
    if (urlToken) {
      setToken(urlToken)
    }
    if (urlEmail) {
      setEmail(urlEmail)
    }
  }, [location.search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!password || !confirmPassword || !token || !email) {
      setError("Please fill in all fields.")
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all fields.",
      })
      return
    }
    if (password.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match.")
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match.",
      })
      return
    }

    setLoading(true)
    try {
      await axios.post("reset-password", {
        password: password.trim(),
        password_confirmation: confirmPassword.trim(),
        token,
        email,
      })
      setSuccess("Password reset successful!")
      setPassword("")
      setConfirmPassword("")
      setToken("")
      setEmail("")
      setResetSuccess(true)
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Password reset successful!",
      })
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to reset password. Please try again."
      setError(errMsg)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errMsg,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-400 animate-gradient-x">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-blue-400 via-purple-300 to-pink-200 opacity-10 rounded-full blur-2xl animate-spin-slow" />
      </div>

      <Card className="w-full max-w-md md:w-[90%] shadow-2xl rounded-2xl border border-white/30 backdrop-blur-lg bg-white/20 z-10 animate-fade-in-up transition-all duration-700 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:border-blue-300/60">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-600/80 rounded-full p-4 shadow-lg mb-2">
              <FontAwesomeIcon icon={faKey} className="text-white text-3xl" />
            </div>
            <CardTitle className="text-3xl font-bold text-center text-blue-100 drop-shadow-lg">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center text-base text-blue-100 mt-1">
              Enter your details to reset your password.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5 relative">
              <Label htmlFor="email" className="text-blue-100">Email</Label>
              <Input
                id="email"
                type="email"
                readOnly
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={resetSuccess}
                className="bg-blue-50/80 h-12 rounded-lg border-2 focus:border-blue-400 transition-all duration-200"
              />
            </div>
            
            <Input
              id="token"
              type="hidden"
              value={token}
              onChange={e => setToken(e.target.value)}
              required
              disabled={resetSuccess}
            />

            <div className="flex flex-col gap-1.5 relative">
              <Label htmlFor="password" className="text-blue-100">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={resetSuccess}
                className="bg-blue-50/80 h-12 rounded-lg border-2 focus:border-blue-400 transition-all duration-200 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-[#93c5fd]"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ background: "none", border: "none", padding: 0, margin: 0 }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="flex flex-col gap-1.5 relative">
              <Label htmlFor="confirm-password" className="text-blue-100">Confirm Password</Label>
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={resetSuccess}
                className="bg-blue-50/80 h-12 rounded-lg border-2 focus:border-blue-400 transition-all duration-200 pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-[#93c5fd]"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{ background: "none", border: "none", padding: 0, margin: 0 }}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-sm text-center">{success}</div>
            )}

            <div className="flex flex-col space-y-2">
              <Button
                type="submit"
                disabled={loading || resetSuccess}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <>
                    <span>Sending...</span>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </Button>
              <Button
                type="button"
                disabled={!resetSuccess}
                onClick={() => navigate("/user-login")}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white hover:text-white"
              >
                <span>Back to login</span>
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
  )
}

export default ResetPassword