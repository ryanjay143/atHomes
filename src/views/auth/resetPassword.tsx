import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import axios from "../../plugin/axios"
import Swal from "sweetalert2"
import { useNavigate, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"

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
    <div className="flex items-center justify-center min-h-screen md:p-5">
      <Card className="w-full max-w-md shadow-lg rounded-xl border border-b-4 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-800">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center text-sm text-gray-500 mt-1">
            Enter your details to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5 relative">
            <Input
              id="email"
              type="email"
              readOnly
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={resetSuccess}
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={resetSuccess}
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
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={resetSuccess}
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
                className="w-full flex items-center justify-center gap-2"
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
    </div>
  )
}

export default ResetPassword