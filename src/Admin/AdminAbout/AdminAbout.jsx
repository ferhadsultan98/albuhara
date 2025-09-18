import { useState, useEffect } from "react";
import api from "../../Api";
import "./AdminAbout.scss";

const AdminAbout = () => {
  const [aboutImage, setAboutImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [preview, setPreview] = useState(null);

  // Check admin status
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAdmin(!!token);
  }, []);

  // Fetch about section
  useEffect(() => {
    api
      .get("/api/about-section/")
      .then((response) => {
        if (response.data.results?.length > 0) {
          setAboutImage(response.data.results[0]);
          const imageUrl = response.data.results[0].image;
          // Əgər image tam URL-dirsə, birbaşa istifadə et, əks halda VITE_API_BASE_URL əlavə et
          setPreview(imageUrl.startsWith("http") ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`);
        }
      })
      .catch((error) => console.error("Error fetching about section:", error));
  }, []);

  // Handle image preview
  useEffect(() => {
    if (newImage) {
      const objectUrl = URL.createObjectURL(newImage);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (aboutImage?.image) {
      const imageUrl = aboutImage.image;
      setPreview(imageUrl.startsWith("http") ? imageUrl : `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`);
    } else {
      setPreview(null);
    }
  }, [newImage, aboutImage]);

  // Handle image update
  const handleImageUpdate = async (e) => {
    e.preventDefault();
    if (!newImage) return;

    const formData = new FormData();
    formData.append("image", newImage);

    try {
      let response;
      if (aboutImage?.id) {
        response = await api.put(`/api/about-section/${aboutImage.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.post(`/api/about-section/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setAboutImage(response.data);
      setNewImage(null);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <div className="adminAboutContainer">
      <h2 className="adminAboutTitle">About Us</h2>
      {aboutImage?.image ? (
        <img
          src={aboutImage.image.startsWith("http") ? aboutImage.image : `${import.meta.env.VITE_API_BASE_URL}${aboutImage.image}`}
          alt="About Section"
          className="adminAboutImage"
        />
      ) : (
        <p>No image available</p>
      )}
      {isAdmin && (
        <form className="adminForm" onSubmit={handleImageUpdate}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
            className="fileInput"
          />
        
          <button type="submit" className="updateButton" disabled={!newImage}>
            Update Image
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminAbout;