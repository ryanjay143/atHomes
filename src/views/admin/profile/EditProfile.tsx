import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react';
import axios from '../../../plugin/axios';
import Swal from 'sweetalert2';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { faCamera, faEye, faEyeSlash, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

const EditProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [user, setUser] = useState<any>({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [activeTab, setActiveTab] = useState<'account' | 'personal'>('account');
  const [personalinfo, setPersonalInfo] = useState<any>({
    first_name: '',
    middle_name: '',
    last_name: '',
    extension_name: '',
    complete_address: '',
    phone: '',
    profile_pic: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (activeTab === 'account') {
      setUser({ ...user, [name]: value });
    } else {
      setPersonalInfo({ ...personalinfo, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    if (file) {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setImageError('Only image files (jpeg, jpg, png, webp) are allowed.');
        setProfilePicPreview(null);
        setPersonalInfo({ ...personalinfo, profile_pic: '' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      // Validate file size
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setImageError(`Image size must be less than ${MAX_IMAGE_SIZE_MB}MB.`);
        setProfilePicPreview(null);
        setPersonalInfo({ ...personalinfo, profile_pic: '' });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setProfilePicPreview(imageUrl);
      setPersonalInfo({ ...personalinfo, profile_pic: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    // Prevent submit if image error exists
    if (imageError) {
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: imageError,
        icon: "error",
        showConfirmButton: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);

    formData.append('first_name', personalinfo.first_name);
    formData.append('middle_name', personalinfo.middle_name);
    formData.append('last_name', personalinfo.last_name);
    formData.append('extension_name', personalinfo.extension_name || '');
    formData.append('phone', personalinfo.phone);
    formData.append('complete_address', personalinfo.complete_address);

    if (user.password) {
      formData.append('password', user.password);
      formData.append('password_confirmation', user.password_confirmation);
    }

    // Handle profile picture if available
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      formData.append('profile_pic', fileInput.files[0]);
    }

    try {
      const response = await axios.post('admin/edit-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      Swal.fire({
        title: "Success",
        text: response.data.message,
        icon: "success",
        showConfirmButton: false,
        showCloseButton: true,
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
      adminProfile();
    } catch (error) {
      // Handle error as needed
    } finally {
      setLoading(false);
    }
  };

  const adminProfile = async () => {
    try {
      const response = await axios.get('agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      // Sanitize personalInfo: convert nulls to empty strings
      const info = response.data.personalInfo;
      setPersonalInfo({
        first_name: info.first_name ?? '',
        middle_name: info.middle_name ?? '',
        last_name: info.last_name ?? '',
        extension_name: info.extension_name ?? '',
        complete_address: info.complete_address ?? '',
        phone: info.phone ?? '',
        profile_pic: info.profile_pic ?? '',
      });

      setUser(response.data.user);
    } catch (error) {
      // Handle error as needed
    }
  };

  useEffect(() => {
    adminProfile();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br relative overflow-hidden py-10">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />

      <Card className="w-full max-w-2xl bg-white/60 border-b-4 border-primary rounded-2xl shadow-2xl backdrop-blur-lg transition-all duration-300 hover:shadow-blue-200 z-10">
        <div className="flex flex-col items-center py-8 px-6">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                {(profilePicPreview || personalinfo.profile_pic) ? (
                  <AvatarImage
                    src={
                      profilePicPreview
                        ? profilePicPreview
                        : typeof personalinfo.profile_pic === 'string'
                          ? `${import.meta.env.VITE_URL}/${personalinfo.profile_pic}`
                          : undefined
                    }
                    alt="Profile"
                    className="rounded-full border border-border object-cover"
                  />
                ) : null}
                <AvatarFallback className='font-bold text-3xl bg-[#172554] text-[#eff6ff]'>
                  {personalinfo.first_name
                    ? personalinfo.first_name.charAt(0).toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="profile_pic"
                className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow-lg cursor-pointer group-hover:scale-110 transition-transform"
                title="Change Profile Picture"
              >
                <FontAwesomeIcon icon={faCamera} />
                <input
                  id="profile_pic"
                  type="file"
                  name="profile_pic"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              Profile Picture (JPEG, PNG, WEBP, Max 5MB)
            </span>
            {imageError && (
              <div className="text-red-600 text-sm mt-1">{imageError}</div>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-blue-900 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faUserEdit} className="text-blue-500" />
            Edit Profile
          </h1>

          {/* Modern Tabs */}
          <div className="flex w-full mb-6 rounded-xl overflow-hidden shadow">
            <button
              className={`flex-1 py-3 text-lg font-semibold transition-all duration-200 ${
                activeTab === 'account'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white/70 text-blue-700 hover:bg-blue-100'
              }`}
              onClick={() => setActiveTab('account')}
              type="button"
            >
              User Account
            </button>
            <button
              className={`flex-1 py-3 text-lg font-semibold transition-all duration-200 ${
                activeTab === 'personal'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white/70 text-blue-700 hover:bg-blue-100'
              }`}
              onClick={() => setActiveTab('personal')}
              type="button"
            >
              Personal Info
            </button>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            {activeTab === 'account' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-blue-900 font-semibold mb-1">Username</label>
                  <Input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-blue-900 font-semibold mb-1">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition"
                    required
                  />
                </div>
                {/* Change password with eye icon */}
                <div className="relative">
                  <label className="block text-blue-900 font-semibold mb-1">Change password</label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-12 transform -translate-y-1/2 text-blue-400 hover:text-blue-700"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {/* Password confirmation with eye icon */}
                <div className="relative">
                  <label className="block text-blue-900 font-semibold mb-1">Password confirmation</label>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={user.password_confirmation}
                    onChange={handleChange}
                    className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition pr-12"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-12 transform -translate-y-1/2 text-blue-400 hover:text-blue-700"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    style={{ background: "none", border: "none", padding: 0, margin: 0 }}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'personal' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-blue-900 font-semibold mb-1">Firstname</label>
                    <Input
                      type="text"
                      name="first_name"
                      value={personalinfo.first_name}
                      onChange={handleChange}
                      className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-900 font-semibold mb-1">Middlename</label>
                    <Input
                      type="text"
                      name="middle_name"
                      value={personalinfo.middle_name}
                      onChange={handleChange}
                      className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-900 font-semibold mb-1">Lastname</label>
                    <Input
                      type="text"
                      name="last_name"
                      value={personalinfo.last_name}
                      onChange={handleChange}
                      className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-900 font-semibold mb-1">Extension</label>
                    <Input
                      type="text"
                      name="extension_name"
                      value={personalinfo.extension_name}
                      onChange={handleChange}
                      className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blue-900 font-semibold mb-1">Address</label>
                    <Input
                      type="text"
                      name="complete_address"
                      value={personalinfo.complete_address}
                      onChange={handleChange}
                      className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-900 font-semibold mb-1">Phone</label>
                    <Input
                      type="text"
                      name="phone"
                      value={personalinfo.phone}
                      onChange={handleChange}
                      className="w-full h-12 px-3 py-2 rounded-lg border-2 border-blue-200 focus:border-blue-400 bg-white/80 transition"
                    />
                  </div>
                </div>
              </div>
            )}
            <Button
              type="submit"
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Saving...</span>
                  <span className="animate-spin cursor-not-allowed border-2 border-white border-t-transparent rounded-full w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  <span>Save changes</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </Card>
      {/* Custom Animations */}
      <style>
        {`
          .fade-in-left {
            animation: fadeInLeft 0.7s cubic-bezier(.39,.575,.565,1) both;
          }
          @keyframes fadeInLeft {
            0% { opacity: 0; transform: translateX(-40px);}
            100% { opacity: 1; transform: translateX(0);}
          }
        `}
      </style>
    </div>
  );
};

export default EditProfile;