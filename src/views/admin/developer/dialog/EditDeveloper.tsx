import { useState, useRef } from "react";
import axios from "../../../../plugin/axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { faPen, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

function EditDeveloper({ developer, fetchDevelopers }: any) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    `${import.meta.env.VITE_URL}/${developer.image}`
  );
  const [isImageChanged, setIsImageChanged] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    dev_name: developer.dev_name,
    dev_email: developer.dev_email,
    dev_phone: developer.dev_phone,
    dev_location: developer.dev_location,
  });
  const [errors, setErrors] = useState({
    dev_name: "",
    dev_email: "",
    dev_phone: "",
    dev_location: "",
    image: "",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!validImageTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Invalid image type. Only JPEG, PNG, JPG are allowed.",
        }));
        return;
      }
      if (file.size > maxSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Image size must not exceed 5MB.",
        }));
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsImageChanged(true);
      setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
    }
  };

  const handleCancelImageChange = () => {
    setSelectedImage(null);
    setImagePreview(`${import.meta.env.VITE_URL}/${developer.image}`);
    setIsImageChanged(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      dev_name: formData.dev_name ? "" : "Developer name is required.",
      dev_email: formData.dev_email ? "" : "Email address is required.",
      dev_phone: formData.dev_phone ? "" : "Phone number is required.",
      dev_location: formData.dev_location ? "" : "Location is required.",
      image: "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (loading) return;
    setLoading(true);

    const data = new FormData();
    data.append("dev_name", formData.dev_name);
    data.append("dev_email", formData.dev_email);
    data.append("dev_phone", formData.dev_phone);
    data.append("dev_location", formData.dev_location);
    if (selectedImage) {
      data.append("image", selectedImage);
    }

    try {
      const response = await axios.post(
        `updateDeveloper/${developer.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      fetchDevelopers();
      setIsImageChanged(false);
      setIsDialogOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } catch (error) {
      console.error("Error updating developer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <Button className="w-8 h-8 rounded-md bg-gradient-to-r from-green-400 to-green-600 shadow hover:from-green-500 hover:to-green-700 transition-all duration-200">
          <FontAwesomeIcon icon={faPen} className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className='md:pt-10 h-full md:w-[90%] md:max-w-xl overflow-auto bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl border border-blue-200'>
        <DialogHeader>
          <DialogTitle className="text-start text-2xl font-bold text-blue-900">Edit Developer</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit} className="mt-5 text-start space-y-5">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="developer" className="font-semibold text-blue-900">Developer Name</Label>
                <Input
                  type="text"
                  className="uppercase rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  name="dev_name"
                  value={formData.dev_name}
                  onChange={handleInputChange}
                  autoFocus
                />
                {errors.dev_name && <span className="text-red-500 text-xs">{errors.dev_name}</span>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="email" className="font-semibold text-blue-900">Email Address</Label>
                <Input
                  type="email"
                  name="dev_email"
                  className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.dev_email}
                  onChange={handleInputChange}
                />
                {errors.dev_email && <span className="text-red-500 text-xs">{errors.dev_email}</span>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="location" className="font-semibold text-blue-900">Location</Label>
                <Input
                  type="text"
                  name="dev_location"
                  className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.dev_location}
                  onChange={handleInputChange}
                />
                {errors.dev_location && <span className="text-red-500 text-xs">{errors.dev_location}</span>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="phone" className="font-semibold text-blue-900">Phone Number</Label>
                <Input
                  type="text"
                  name="dev_phone"
                  className="rounded-lg border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.dev_phone}
                  onChange={handleInputChange}
                />
                {errors.dev_phone && <span className="text-red-500 text-xs">{errors.dev_phone}</span>}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="image" className="font-semibold text-blue-900">Developer Image</Label>
                <label
                  htmlFor="dev-image-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-4 bg-white hover:bg-blue-50 cursor-pointer transition-all duration-200"
                >
                  <FontAwesomeIcon icon={faUpload} className="text-blue-400 text-3xl mb-2" />
                  <span className="text-blue-700 font-medium">Click to upload image here</span>
                  <span className="text-xs text-gray-500 mt-1">(JPEG, PNG, JPG only, max 5MB)</span>
                  <Input
                    id="dev-image-upload"
                    type='file'
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </label>
                {errors.image && <span className="text-red-500 text-xs">{errors.image}</span>}
              </div>

              {/* Image Preview */}
              <div className="relative flex justify-center">
                <img
                  src={imagePreview}
                  alt={developer.dev_name}
                  className="object-cover w-36 h-36 rounded-lg border-2 border-blue-200 shadow-md"
                />
                {isImageChanged && (
                  <Button
                    type="button"
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center shadow"
                    onClick={handleCancelImageChange}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg shadow hover:from-green-600 hover:to-green-800 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span>Saving...</span>
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default EditDeveloper;