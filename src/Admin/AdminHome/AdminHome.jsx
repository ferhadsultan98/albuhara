import { useState, useEffect } from "react";
import api from "../../Api";
import "./AdminHome.scss";

const AdminHome = () => {
  const [topSlides, setTopSlides] = useState([]);
  const [bottomSlides, setBottomSlides] = useState([]);
  const [newTopImage, setNewTopImage] = useState(null);
  const [newBottomImage, setNewBottomImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    api
      .get("/api/home-slider-top/")
      .then((res) =>
        setTopSlides(
          Array.isArray(res.data) ? res.data : res.data.results || []
        )
      )
      .catch((err) => console.error("Error fetching top slides:", err));

    api
      .get("/api/home-slider-bottom/")
      .then((res) =>
        setBottomSlides(
          Array.isArray(res.data) ? res.data : res.data.results || []
        )
      )
      .catch((err) => console.error("Error fetching bottom slides:", err));
  }, []);

  const handleTopUpload = async (e) => {
    e.preventDefault();
    if (!newTopImage) return;

    const formData = new FormData();
    formData.append("image", newTopImage);

    try {
     const res = await api.post("/api/home-slider-top/", formData);
      setTopSlides([...topSlides, res.data]);
      setNewTopImage(null);
      e.target.reset(); // Reset form after upload
    } catch (err) {
      console.error("Error uploading top image:", err);
    }
  };

  const handleBottomUpload = async (e) => {
    e.preventDefault();
    if (!newBottomImage) return;

    const formData = new FormData();
    formData.append("image", newBottomImage);

    try {
      const res = await api.post("/api/home-slider-bottom/", formData);
      setBottomSlides([...bottomSlides, res.data]);
      setNewBottomImage(null);
      e.target.reset(); // Reset form after upload
    } catch (err) {
      console.error("Error uploading bottom image:", err);
    }
  };

  const handleDeleteTop = async (id) => {
    try {
      await api.delete(`/api/home-slider-top/${id}/`);
      setTopSlides(topSlides.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting top slide:", err);
    }
  };

  const handleDeleteBottom = async (id) => {
    try {
      await api.delete(`/api/home-slider-bottom/${id}/`);
      setBottomSlides(bottomSlides.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting bottom slide:", err);
    }
  };

  const getImageUrl = (imagePath) => {
    // Ensure the base URL is correctly set and the image path is valid
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  return (
    <div className="adminHomeContainer">
      <h2 className="adminHomeTitle">Home Slider - Top</h2>
      <div className="slider">
        {Array.isArray(topSlides) && topSlides.length > 0 ? (
          topSlides.map((slide) => (
            <div key={slide.id} className="slide">
              <img
                src={getImageUrl(slide.image)}
                alt={`Top Slide ${slide.id}`}
                className="slideImage"
                onError={(e) => (e.target.src = "/fallback-image.png")} // Fallback image
              />
              {isAdmin && (
                <button
                  className="deleteButton"
                  onClick={() => handleDeleteTop(slide.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No top slides available</p>
        )}
      </div>
      {isAdmin && (
        <form className="adminForm" onSubmit={handleTopUpload}>
          <input
            type="file"
            accept="image/jpeg,image/png" 
            onChange={(e) => setNewTopImage(e.target.files[0])}
            className="fileInput"
          />
          <button type="submit" className="uploadButton">
            Upload Top Image
          </button>
        </form>
      )}

      <h2 className="adminHomeTitle">Home Slider - Bottom</h2>
      <div className="slider">
        {Array.isArray(bottomSlides) && bottomSlides.length > 0 ? (
          bottomSlides.map((slide) => (
            <div key={slide.id} className="slide">
              <img
                src={getImageUrl(slide.image)}
                alt={`Bottom Slide ${slide.id}`}
                className="slideImage"
                onError={(e) => (e.target.src = "/fallback-image.png")} // Fallback image
              />
              {isAdmin && (
                <button
                  className="deleteButton"
                  onClick={() => handleDeleteBottom(slide.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No bottom slides available</p>
        )}
      </div>
      {isAdmin && (
        <form className="adminForm" onSubmit={handleBottomUpload}>
          <input
            type="file"
            accept="image/jpeg,image/png" 
            onChange={(e) => setNewBottomImage(e.target.files[0])}
            className="fileInput"
          />
          <button type="submit" className="uploadButton">
            Upload Bottom Image
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminHome;