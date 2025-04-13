import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SidebarContext } from "../Context/SibebarContext";
import { SongContext } from "../Context/SongContext";
import { motion } from "framer-motion";
import { FiUpload, FiMusic, FiUser, FiInfo, FiImage } from "react-icons/fi";

const UploadSong = () => {
  const navigate = useNavigate();
  const { showMenu, setShowMenu } = useContext(SidebarContext);
  const { __URL__ } = useContext(SongContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    file: null,
    title: "",
    artist: "",
    album: "",
    description: ""
  });

  useEffect(() => {
    if (showMenu) setShowMenu(false);
  }, [showMenu, setShowMenu]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formPayload = new FormData();
      formPayload.append("file", formData.file);
      formPayload.append("title", formData.title);
      formPayload.append("artist", formData.artist);
      formPayload.append("album", formData.album);
      formPayload.append("description", formData.description);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
          "x-auth-token": localStorage.getItem("access_token"),
        },
      };

      const result = await axios.post(
        `${__URL__}/api/v1/song/upload`,
        formPayload,
        config
      );

      if (result.status === 201) {
        setSuccess("Song uploaded successfully!");
        setTimeout(() => navigate("/explore"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload song. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoggedIn = !!localStorage.getItem("access_token");
  const isFormValid = formData.file && formData.title && formData.artist;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white"
    >
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-10"
        >
          <FiUpload className="mx-auto text-4xl text-yellow-400 mb-3" />
          <h1 className="text-3xl font-bold mb-2">Upload Your Music</h1>
          <p className="text-gray-400">Share your sound with the world</p>
        </motion.div>

        {!isLoggedIn && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8 text-center">
            You need to be logged in to upload songs.
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-8 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/50 border border-green-700 rounded-lg p-4 mb-8 text-center">
            {success}
          </div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-6 bg-gray-800/50 rounded-xl p-6 shadow-lg border border-gray-700"
        >
          <div className="space-y-1">
            <label className="flex items-center text-gray-300 mb-2">
              <FiMusic className="mr-2" /> Song Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
              placeholder="Enter song title"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-gray-300 mb-2">
              <FiUser className="mr-2" /> Artist Name
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
              placeholder="Enter artist name"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-gray-300 mb-2">
              <FiImage className="mr-2" /> Album Name
            </label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
              placeholder="Enter album name"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-gray-300 mb-2">
              <FiInfo className="mr-2" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition min-h-[100px]"
              placeholder="Tell us about your song"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-gray-300 mb-2">
              <FiMusic className="mr-2" /> Audio File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="text-3xl text-gray-400 mb-2" />
                  <p className="mb-2 text-sm text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    MP3, WAV, or other audio formats (MAX. 50MB)
                  </p>
                </div>
                <input 
                  onChange={handleFileChange} 
                  type="file" 
                  name="file" 
                  accept="audio/*" 
                  className="hidden" 
                  required 
                />
              </label>
            </div>
            {formData.file && (
              <p className="mt-2 text-sm text-gray-400">
                Selected: {formData.file.name}
              </p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={!isLoggedIn || !isFormValid || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-medium transition ${(!isLoggedIn || !isFormValid) ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload Song"
            )}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default UploadSong;