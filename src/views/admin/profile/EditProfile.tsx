import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React, { useEffect, useRef, useState } from 'react';
import axios from '../../../plugin/axios';
import Swal from 'sweetalert2';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

const EditProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
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
    profile_pic: '', // Ensure this property is included
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
      setPersonalInfo({ ...personalinfo, profile_pic: file }); // store the file, not the URL
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
        // Optionally perform actions after the alert closes
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

      setUser(response.data.user);
      setPersonalInfo(response.data.personalInfo);
    } catch (error) {
      // Handle error as needed
    }
  };

  useEffect(() => {
    adminProfile();
  }, []);

  return (
    <div className="flex justify-center items-start mt-10 md:min-h-screen md:items-center md:mt-0">
      <Card className="max-w-xl w-full bg-white shadow-md rounded-lg p-6 md:w-[90%]">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 ${activeTab === 'account' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('account')}
          >
            User Account
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 'personal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {activeTab === 'account' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <Input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Change password</label>
                <Input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password confirmation</label>
                <Input
                  type="password"
                  name="password_confirmation"
                  value={user.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </>
          )}
          {activeTab === 'personal' && (
            <>
              <div className='grid grid-cols-4 md:grid-cols-2 md:gap-2 gap-4 mt-10'>
                <div className="mb-4">
                  <label className="block text-gray-700">Firstname</label>
                  <Input
                    type="text"
                    name="first_name"
                    value={personalinfo.first_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Middlename</label>
                  <Input
                    type="text"
                    name="middle_name"
                    value={personalinfo.middle_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Lastname</label>
                  <Input
                    type="text"
                    name="last_name"
                    value={personalinfo.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Extension</label>
                  <Input
                    type="text"
                    name="extension_name"
                    value={personalinfo.extension_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className="mb-4">
                  <label className="block text-gray-700">Address</label>
                  <Input
                    type="text"
                    name="complete_address"
                    value={personalinfo.complete_address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone</label>
                  <Input
                    type="text"
                    name="phone"
                    value={personalinfo.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="flex justify-center items-center w-full">
                    <Avatar className="h-32 w-32 md:h-12 md:w-12 border-primary border-4">
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
                      <AvatarFallback className='font-bold text-2xl bg-[#172554] text-[#eff6ff] '>
                        {personalinfo.first_name
                          ? personalinfo.first_name.charAt(0).toUpperCase()
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-sm text-red-600">
                    Profile Picture (JPEG, PNG, WEBP, Max 5MB)
                  </p>
                  <Input
                    type="file"
                    name="profile_pic"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="w-full px-3 py-2 border rounded-lg"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  {imageError && (
                    <div className="text-red-600 text-sm mt-1">{imageError}</div>
                  )}
                </div>
              </div>
            </>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <span>Saving...</span>
                <span className="animate-spin cursor-not-allowed border-2 border-white border-t-transparent rounded-full w-4 h-4" />
              </>
            ) : (
              <>
                <span>Save changes</span>
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditProfile;