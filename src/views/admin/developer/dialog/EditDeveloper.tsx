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
import { faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
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
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "Invalid image type. Only jpeg, png, jpg, gif are allowed.",
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

      console.log("Developer updated successfully:", response.data);

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
        <Button className="w-8 h-8 rounded-md bg-green-500 hover:bg-green-400">
          <FontAwesomeIcon icon={faPen} className="text-[#eff6ff]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-start">Edit Developer</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit} className="mt-5 text-start space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="developer">Developer name</Label>
                <Input
                  type="text"
                  className="uppercase"
                  name="dev_name"
                  value={formData.dev_name}
                  onChange={handleInputChange}
                />
                {errors.dev_name && <span className="text-red-500 text-sm">{errors.dev_name}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  type="email"
                  name="dev_email"
                  value={formData.dev_email}
                  onChange={handleInputChange}
                />
                {errors.dev_email && <span className="text-red-500 text-sm">{errors.dev_email}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  type="text"
                  name="dev_location"
                  value={formData.dev_location}
                  onChange={handleInputChange}
                />
                {errors.dev_location && <span className="text-red-500 text-sm">{errors.dev_location}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  type="text"
                  name="dev_phone"
                  value={formData.dev_phone}
                  onChange={handleInputChange}
                />
                {errors.dev_phone && <span className="text-red-500 text-sm">{errors.dev_phone}</span>}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="image">Developer image</Label>
                <Input
                  type="file"
                  className="uppercase"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
                {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}
              </div>

              {/* Image Preview */}
              <div className="relative">
                <img
                  src={imagePreview}
                  alt={developer.dev_name}
                  className="object-cover w-full h-32 rounded-md"
                />
                {isImageChanged && (
                  <Button
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-400 text-white rounded-full h-8 w-8"
                    onClick={handleCancelImageChange}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                )}
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-400"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span>Saving...</span>
                      <span className="animate-spin cursor-not-allowed border-2 border-white border-t-transparent rounded-full w-4 h-4" />
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