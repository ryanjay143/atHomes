import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "@/plugin/axios";
import Swal from "sweetalert2";

const generateAccountNumber = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let accountNumber = 'Acc-';
  for (let i = 0; i < 9; i++) {
    const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
    accountNumber += randomCharacter;
  }
  return accountNumber;
};

// Define a type for the errors object
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
  const [accountNumber, setAccountNumber] = useState('');
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
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

  useEffect(() => {
    const newAccountNumber = generateAccountNumber();
    setAccountNumber(newAccountNumber);
    setFormData((prevData) => ({ ...prevData, acct_number: newAccountNumber }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
  
    // If the user manually changes the password, reset the generated password state
    setIsPasswordGenerated(false);
  
    // Update the password in formData
    setFormData({ ...formData, password: value, confirm_password: '' }); // Clear confirm_password
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const [loading, setLoading] = useState(false);

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
  
    setErrors(newErrors);
  
    // If there are errors, stop submission
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('register', formData);
  
      Swal.fire({
        title: "Registration successful!",
        text: "Please wait for approval.",
        icon: "success",
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
      });
  
      console.log(response.data);
  
      // Reset form data to initial state
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
  
      // Check if the error is due to the email being already taken
      if (error.response && error.response.data && error.response.data.message === "Email already taken") {
        Swal.fire({
          title: "Email already taken!",
          text: "Please login instead.",
          icon: "warning",
          showConfirmButton: true,
        }).then(() => {
          navigate('/athomes/user-register'); // Redirect to login page
        });
      } else {
        Swal.fire({
          title: "Registration failed!",
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
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-10">
      <form onSubmit={handleSubmit} className="w-full md:h-[600px] md:overflow-auto">
        <CardHeader className="flex justify-center items-start">
          <CardTitle className="text-3xl font-bold z-50">Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <span className="text-[#172554]">Personal Details</span>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-4 md:gap-2">
              <div>
                <Label htmlFor="first_name">First name</Label> <span className="text-red-500">*</span>
                <Input type="text" name="first_name" className="h-12 bg-[#eff6ff]" placeholder="Enter your first name" onChange={handleChange} />
                {errors.first_name && <span className="text-red-500 text-sm">{errors.first_name}</span>}
              </div>
              <div>
                <Label htmlFor="middle_name">Middle name</Label>
                <Input type="text" name="middle_name" className="h-12 bg-[#eff6ff]" placeholder="Enter your middle name" onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="last_name">Last name</Label> <span className="text-red-500">*</span>
                <Input type="text" name="last_name" className="h-12 bg-[#eff6ff]" placeholder="Enter your last name" onChange={handleChange} />
                {errors.last_name && <span className="text-red-500 text-sm">{errors.last_name}</span>}
              </div>
              <div>
                <Label htmlFor="extension_name">Extension name</Label> <span>(Jr, Sr. III)</span>
                <Input type="text" name="extension_name" className="h-12 bg-[#eff6ff]" placeholder="Enter your extension name" onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-4 md:gap-2">
              <div>
                <Label htmlFor="email">Email</Label> <span className="text-red-500">*</span>
                <Input type="email" name="email" className="h-12 bg-[#eff6ff]" placeholder="Enter your email" onChange={handleChange} />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
              </div>
              <div>
                <Label htmlFor="phone">Mobile number</Label> <span className="text-red-500">*</span>
                <Input type="text" name="phone" className="h-12 bg-[#eff6ff]" placeholder="Enter mobile number" onChange={handleChange} />
                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label> <span className="text-red-500">*</span>
                <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="h-12 bg-[#eff6ff]">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
              </div>
              <div>
                <Label htmlFor="complete_address">Complete address</Label> <span className="text-red-500">*</span>
                <Input type="text" name="complete_address" className="h-12 bg-[#eff6ff]" placeholder="Enter complete address" onChange={handleChange} />
                {errors.complete_address && <span className="text-red-500 text-sm">{errors.complete_address}</span>}
              </div>
            </div>

            <span className="text-[#172554]">Account Details</span>
            <div className="grid grid-cols-4 md:grid-cols-1 gap-4 gap-y-4 md:gap-2">
              <div>
                <Label htmlFor="acct_number">Account number</Label>
                <Input type="text" name="acct_number" className="h-12 bg-[#eff6ff]" value={accountNumber} readOnly />
              </div>
              <div>
                <Label htmlFor="username">Username</Label> <span className="text-red-500">*</span>
                <Input type="text" name="username" className="h-12 bg-[#eff6ff]" placeholder="Enter username" onChange={handleChange} />
                {errors.username && <span className="text-red-500 text-sm">{errors.username}</span>}
              </div>
              <div>
                <div>
                    <Label htmlFor="password">Password</Label> <span className="text-red-500">*</span>
                    <span
                      className="text-blue-500 text-sm cursor-pointer float-end hover:underline"
                      onClick={() => {
                        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                        let generatedPassword = '';
                        for (let i = 0; i < 12; i++) {
                          const randomCharacter = characters.charAt(Math.floor(Math.random() * characters.length));
                          generatedPassword += randomCharacter;
                        }
                        setFormData({ ...formData, password: generatedPassword, confirm_password: generatedPassword });
                        setPasswordVisible(true); // Show the password after generating it
                        setIsPasswordGenerated(true); // Mark password as generated
                      }}
                    >
                      Or generate password
                    </span>
                    <div className="relative">
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        className="h-12 bg-[#eff6ff] pr-10"
                        placeholder="Password"
                        value={formData.password} // Bind the input to the formData state
                        onChange={handlePasswordChange} // Use the new handler
                      />
                      <span className="float-end text-[9px] text-[#3b82f6] font-bold">Password must be 8-12 characters long.</span>
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3"
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} className="text-[#93c5fd]" />
                      </button>
                    </div>
                  {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirm_password">Confirm Password</Label> <span className="text-red-500">*</span>
                <div className="relative">
                  <Input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirm_password"
                    className="h-12 bg-[#eff6ff] pr-10"
                    placeholder="Confirm Password"
                    value={formData.confirm_password} // Bind the input to the formData state
                    onChange={handleChange}
                    readOnly={isPasswordGenerated} // Make the field readonly if the password is generated
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center px-3"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} className="text-[#93c5fd]" />
                  </button>
                </div>
                {errors.confirm_password && <span className="text-red-500 text-sm">{errors.confirm_password}</span>}
              </div>
            </div>
           

            <span className="text-[#172554]">Identity Details</span>
            <div className="grid md:text-sm gap-4 gap-y-4 md:gap-3">

              <div className="grid grid-cols-3 md:grid-cols-1 gap-4 md:gap-2">
                <div>
                  <Label htmlFor="prc_liscence_number">PRC License Number</Label>
                  <Input type="text" name="prc_liscence_number" className="h-12 bg-[#eff6ff]" placeholder="Enter PRC License No:" onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="dhsud_registration_number">DHSUD Registration Number</Label>
                  <Input
                    type="text"
                    name="dhsud_registration_number"
                    className="h-12 bg-[#eff6ff]"
                    placeholder="Enter DHSUD Registration No:"
                    onChange={(e) => {
                      handleChange(e); // Update the formData state
                      console.log("DHSUD Registration Number:", e.target.value); // Log the value to the console
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label> <span className="text-red-500">*</span>
                  <Select
                    onValueChange={(value) => {
                      console.log("Selected Role:", value); // Log the selected value to the console
                      setFormData({ ...formData, role: value });
                    }}
                  >
                    <SelectTrigger className="h-12 bg-[#eff6ff]">
                      <SelectValue placeholder="Select Agent or Broker" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Agent</SelectItem>
                      <SelectItem value="2">Broker</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                </div>
              </div>
             

                <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-2">
                  <div>
                    <Label htmlFor="validation_date">Validity Date</Label>
                    <Input
                      type="date"
                      name="validation_date"
                      className="h-12 bg-[#eff6ff]"
                      onChange={(e) => {
                        const rawDate = e.target.value; // The raw value from the input (YYYY-MM-DD)
                        const formattedDate = rawDate.split("-").reverse().join("-"); // Format to DD-MM-YYYY
                        handleChange({ target: { name: "validation_date", value: formattedDate } }); // Update formData
                        console.log("Validation Date:", formattedDate); // Log the formatted date
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="last_school_att">Last School or Course attended</Label> <span className="text-red-500">*</span>
                    <Input type="text" name="last_school_att" className="h-12 bg-[#eff6ff]" placeholder="Enter Last School or Course attended" onChange={handleChange} />
                    {errors.last_school_att && <span className="text-red-500 text-sm">{ errors.last_school_att}</span>}
                  </div>
                </div>
            </div>

              

            <div className="flex justify-between gap-2">
              <div className="md:hidden">
                <Link to="/athomes/user-login">
                  <Button className="bg-red-500 hover:bg-red-600">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Back
                  </Button>
                </Link>
              </div>
              <div className="md:w-full">
                <Button
                  type="submit"
                  className="md:w-full bg-green-600 hover:bg-green-700"
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
            </div>

            <div className="flex justify-center space-x-2 mt-4">
              <span>Already have an account?</span>
              <Link to="/athomes/user-login" className="text-primary">
                Login here
              </Link>
            </div>
          </div>
        </CardContent>
      </form>
    </div>
  );
}

export default Register;
