import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "@/plugin/axios";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper function to generate account number
const generateAccountNumber = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let accountNumber = 'Acc-';
  for (let i = 0; i < 9; i++) {
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    accountNumber += randomCharacter;
  }
  return accountNumber;
};

type FormErrors = {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  extension_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  role?: string;
  complete_address?: string;
  username?: string;
  password?: string;
  confirm_password?: string;
  prc_liscence_number?: string;
  dhsud_registration_number?: string;
  validation_date?: string;
  last_school_att?: string;
};

function Register() {
  // State management
  const [accountNumber, setAccountNumber] = useState('');
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    acct_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    extension_name: '',
    email: '',
    phone: '',
    gender: '',
    role: '',
    complete_address: '',
    username: '',
    password: '',
    confirm_password: '',
    prc_liscence_number: '',
    dhsud_registration_number: '',
    validation_date: '',
    last_school_att: '',
  });

  // Effect to generate account number on component mount
  useEffect(() => {
    const newAccountNumber = generateAccountNumber();
    setAccountNumber(newAccountNumber);
    setFormData((prevData) => ({ ...prevData, acct_number: newAccountNumber }));
  }, []);

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setIsPasswordGenerated(false);
    setFormData({ ...formData, password: value, confirm_password: '' });

    // Check password length and complexity
    const hasUpperCase = /[A-Z]/.test(value);
    const hasSymbol = /[!@#$%^&*()]/.test(value);

    if (value.length < 8 || !hasUpperCase || !hasSymbol) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters long, include an uppercase letter and a symbol.",
      }));
    } else {
      setErrors((prevErrors) => {
        const { password, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // Role-based logic
  const isAgent = formData.role === "1";
  const isBroker = formData.role === "2";

  // Real-time PRC License validation
  const prcValue = formData.prc_liscence_number.trim();
  const isPRCNA = prcValue.toUpperCase() === "N/A";
  const isPRCValid =
    (isBroker && prcValue !== "" && !isPRCNA) ||
    (isAgent && prcValue.length > 4);

  // Real-time warning for Broker typing N/A
  const showPRCWarning = isBroker && isPRCNA;

  // Effect: If role changes, reset PRC License and Validity Date
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      prc_liscence_number: '',
      validation_date: '',
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    // Validation logic
    const newErrors: FormErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required.";
    if (!formData.last_name) newErrors.last_name = "Last name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.phone) newErrors.phone = "Mobile number is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.role) newErrors.role = "Account type is required.";
    if (!formData.complete_address) newErrors.complete_address = "Complete address is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirm_password) newErrors.confirm_password = "Confirm password is required.";
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = "Passwords do not match.";
    if (!formData.last_school_att) newErrors.last_school_att = "Last school or course attended is required.";

    // Conditional validation for Broker
    if (isBroker) {
      if (!prcValue || isPRCNA) {
        newErrors.prc_liscence_number = "PRC License Number is required for Brokers and cannot be N/A.";
      }
      if (
        prcValue &&
        !isPRCNA &&
        !formData.validation_date
      ) {
        newErrors.validation_date = "Validity Date is required for Brokers with a valid PRC License Number.";
      }
    }
    // Conditional validation for Agent
    if (isAgent) {
      if (prcValue.length > 4 && !formData.validation_date) {
        newErrors.validation_date = "Validity Date is required for Agents with a valid PRC License Number.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      await axios.post('register', formData);
      Swal.fire({
        title: "Registration successful!",
        text: "Please wait for approval.",
        icon: "success",
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
      }).then(() => 
        navigate('/')
      );

      setFormData({
        acct_number: generateAccountNumber(),
        first_name: '',
        middle_name: '',
        last_name: '',
        extension_name: '',
        email: '',
        phone: '',
        gender: '',
        role: '',
        complete_address: '',
        username: '',
        password: '',
        confirm_password: '',
        prc_liscence_number: '',
        dhsud_registration_number: '',
        validation_date: '',
        last_school_att: '',
      });
      setErrors({});
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.response && error.response.data && error.response.data.message === "Email already taken") {
        Swal.fire({
          title: "Email already taken!",
          text: "Please login instead.",
          icon: "warning",
          showConfirmButton: true,
        }).then(() => {
          navigate('/user-register');
        });
      } else {
        Swal.fire({
          title: "Error or Email already taken!",
          text: "Please try again.",
          icon: "error",
          showConfirmButton: false,
          showCloseButton: true,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } finally {
      setLoading(false);
      navigate("/user-register");
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password, confirm_password: password });
    setIsPasswordGenerated(true);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-400 to-blue-200 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />

      <form onSubmit={handleSubmit} className="w-full max-w-6xl z-10">
        <CardHeader className="flex justify-center items-start mb-4 text-white">
          <CardTitle className="text-3xl font-bold">Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <span className="block text-lg font-bold mb-2 text-white">Personal Details</span>
            <div className="grid grid-cols-4 gap-4 md:grid-cols-2 text-white">
              <div>
                <Label htmlFor="first_name">First name</Label> <span className="text-red-500">*</span>
                <Input type="text" name="first_name" className="h-9 bg-white text-black" placeholder="Enter your first name" onChange={handleChange} />
                {errors.first_name && <span className="text-red-400 text-sm">{errors.first_name}</span>}
              </div>
              <div>
                <Label htmlFor="middle_name">Middle name</Label>
                <Input type="text" name="middle_name" className="h-9 bg-white text-black" placeholder="Enter your middle name" onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="last_name">Last name</Label> <span className="text-red-500">*</span>
                <Input type="text" name="last_name" className="h-9 bg-white text-black" placeholder="Enter your last name" onChange={handleChange} />
                {errors.last_name && <span className="text-red-400 text-sm">{errors.last_name}</span>}
              </div>
              <div>
                <Label htmlFor="extension_name">Extension name</Label> <span className="md:text-[7px] md:font-bold">(Jr, Sr. III)</span>
                <Input type="text" name="extension_name" className="h-9 bg-white text-black" placeholder="Enter your extension name" onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="block text-white text-lg font-bold mb-2">Contact Details</span>
            <div className="grid grid-cols-4 gap-4 md:grid-cols-2 text-white">
              <div>
                <Label htmlFor="email">Email</Label> <span className="text-red-500">*</span>
                <Input type="email" name="email" className="h-9 bg-white text-black" placeholder="Enter your email" onChange={handleChange} />
                {errors.email && <span className="text-red-400 text-sm">{errors.email}</span>}
              </div>
              <div>
                <Label htmlFor="phone">Mobile number</Label> <span className="text-red-500">*</span>
                <Input type="text" name="phone" className="h-9 bg-white text-black" placeholder="Enter mobile number" onChange={handleChange} />
                {errors.phone && <span className="text-red-400 text-sm">{errors.phone}</span>}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label> <span className="text-red-500">*</span>
                <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="h-9 bg-white/60 text-black">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <span className="text-red-400 text-sm">{errors.gender}</span>}
              </div>
              <div>
                <Label htmlFor="complete_address">Complete address</Label> <span className="text-red-500">*</span>
                <Input type="text" name="complete_address" className="h-9 bg-white text-black" placeholder="Enter complete address" onChange={handleChange} />
                {errors.complete_address && <span className="text-red-400 text-sm">{errors.complete_address}</span>}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="block text-lg font-bold mb-2 text-white">Account Details</span>
            <div className="grid grid-cols-3 gap-4 md:grid-cols-2 text-white">
              <div className="hidden">
                <Label htmlFor="acct_number">Account number</Label>
                <Input type="text" name="acct_number" className="h-9 bg-white text-black" value={accountNumber} readOnly />
              </div>
              <div>
                <Label htmlFor="username">Username</Label> <span className="text-red-500">*</span>
                <Input type="text" name="username" className="h-9 bg-white text-black" placeholder="Enter username" onChange={handleChange} />
                <p className="text-xs text-white">Username must not be the same as your email.</p>
                {errors.username && <span className="text-red-400 text-sm">{errors.username}</span>}
              </div>
              <div className="mt-1">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password <span className="text-red-500">*</span> </Label> 
                  <button
                    type="button"
                    className="text-blue-900 text-sm hover:underline md:text-[10px]"
                    onClick={generateRandomPassword}
                  >
                    Generate Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className="h-9 bg-white pr-10 text-black"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} className="text-gray-500" />
                  </button>
                </div>
                {errors.password && <span className="text-red-600 text-xs font-bold">{errors.password}</span>}
              </div>
              <div>
                <Label htmlFor="confirm_password">Confirm Password</Label> <span className="text-red-500">*</span>
                <div className="relative">
                  <Input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirm_password"
                    className="h-9 bg-white pr-10 text-black"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    readOnly={isPasswordGenerated}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} className="text-gray-500" />
                  </button>
                </div>
                {errors.confirm_password && <span className="text-red-600 text-xs font-bold">{errors.confirm_password}</span>}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <span className="block text-lg font-bold mb-2 text-white">Identity Details</span>
            <div className="grid grid-cols-5 gap-4 w-full md:grid-cols-2 text-white">
              <div>
                <Label htmlFor="type">Type</Label> <span className="text-red-500">*</span>
                <Select
                  onValueChange={(value) => {
                    setFormData({ ...formData, role: value, validation_date: "" });
                  }}
                  value={formData.role}
                >
                  <SelectTrigger className="h-9 bg-white/60 text-black">
                    <SelectValue placeholder="Select Agent or Broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Agent</SelectItem>
                    <SelectItem value="2">Broker</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <span className="text-red-400 text-sm">{errors.role}</span>}
              </div>
              {/* PRC License Number with N/A dropdown, single input only */}
              <div>
                <Label htmlFor="prc_liscence_number">PRC License Number</Label>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    name="prc_liscence_number"
                    className="h-9 bg-white pr-16 text-black/50"
                    placeholder="Enter PRC License No: or type/select N/A"
                    value={formData.prc_liscence_number}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {/* Dropdown button inside the input */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      type="button"
                      className={`bg-blue-500 rounded px-2 py-1 text-xs text-white hover:bg-blue-400 transition ${isBroker ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() =>
                        !isBroker &&
                        handleChange({
                          target: { name: "prc_liscence_number", value: "N/A" },
                        })
                      }
                      tabIndex={-1}
                      disabled={isBroker}
                    >
                      N/A
                    </button>
                  </div>
                </div>
                {/* Show helper text only if there's no error or warning */}
                {!(showPRCWarning || errors.prc_liscence_number) && (
                  <p className="text-[10px] 9">
                    If no PRC License Number, type or click <b>N/A</b> or leave blank.
                  </p>
                )}
                {/* Real-time warning if Broker and N/A */}
                {showPRCWarning && (
                  <span className="text-red-500 text-xs font-bold">
                    Please input a valid PRC License Number.
                  </span>
                )}
                {errors.prc_liscence_number && (
                  <span className="text-red-500 text-sm">{errors.prc_liscence_number}</span>
                )}
              </div>
              <div>
                <Label htmlFor="dhsud_registration_number" className="md:text-[9px] md:font-bold text-xs">
                  DHSUD Registration Number
                </Label>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    name="dhsud_registration_number"
                    className="h-9 bg-white pr-16 text-black/50"
                    placeholder="Enter DHSUD Registration No:"
                    value={formData.dhsud_registration_number}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  {/* Inline N/A button inside the input */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button
                      type="button"
                      className="bg-blue-500 rounded px-2 py-1 text-xs text-white hover:bg-blue-400 transition"
                      onClick={() =>
                        handleChange({
                          target: { name: "dhsud_registration_number", value: "N/A" },
                        })
                      }
                      tabIndex={-1}
                    >
                      N/A
                    </button>
                  </div>
                </div>
                <p className="text-[10px] 9">
                  If no DHSUD Registration Number, type or click <b>N/A</b> or leave blank.
                </p>
                {errors.dhsud_registration_number && (
                  <span className="text-red-500 text-sm">{errors.dhsud_registration_number}</span>
                )}
              </div>
              <div>
                <Label htmlFor="validation_date">Validity Date</Label>
                <Input
                  type="date"
                  name="validation_date"
                  className="h-9 bg-white w-full text-black"
                  onChange={(e) => {
                    const rawDate = e.target.value;
                    const formattedDate = rawDate.split("-").reverse().join("-");
                    handleChange({ target: { name: "validation_date", value: formattedDate } });
                  }}
                  value={formData.validation_date}
                  disabled={!isPRCValid}
                  required={isPRCValid}
                  style={!isPRCValid ? { backgroundColor: "#e5e7eb", cursor: "not-allowed" } : {}}
                />
                {errors.validation_date && <span className="text-red-500 text-sm">{errors.validation_date}</span>}
              </div>
              <div>
                <Label htmlFor="last_school_att" className="text-[11px] font-bold">School or Course attended</Label> <span className="text-red-500 ">*</span>
                <Input type="text" name="last_school_att" className="h-9 bg-white text-black" placeholder="Enter Last School or Course attended" onChange={handleChange} />
                {errors.last_school_att && <span className="text-red-500 text-sm">{errors.last_school_att}</span>}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link to="/user-login">
              <Button className="bg-red-500 hover:bg-red-600">
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Registering...</span>
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                </>
              ) : (
                <>
                  Register now
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            <span className="text-white">Already have an account?</span>
            <Link to="/user-login" className="text-primary">
              Login here
            </Link>
          </div>
        </CardContent>
      </form>
    </div>
  );
}

export default Register;