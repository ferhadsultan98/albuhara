import { useState, useEffect } from "react";
import { Upload, Trash2, Image as ImageIcon, Plus, AlertCircle, X } from "lucide-react";
import api from "../../Api";
import "./AdminHome.scss";

const AdminHome = () => {
  const [topSlides, setTopSlides] = useState([]);
  const [bottomSlides, setBottomSlides] = useState([]);
  const [newTopImage, setNewTopImage] = useState(null);
  const [newBottomImage, setNewBottomImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState({ top: false, bottom: false });
  const [previewUrls, setPreviewUrls] = useState({ top: null, bottom: null });

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const [topRes, bottomRes] = await Promise.all([
        api.get("/api/home-slider-top/"),
        api.get("/api/home-slider-bottom/")
      ]);
      
      setTopSlides(Array.isArray(topRes.data) ? topRes.data : topRes.data.results || []);
      setBottomSlides(Array.isArray(bottomRes.data) ? bottomRes.data : bottomRes.data.results || []);
    } catch (err) {
      setError("Error fetching slides");
      console.error("Error fetching slides:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file, type) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
      
      if (type === 'top') {
        setNewTopImage(file);
      } else {
        setNewBottomImage(file);
      }
    }
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0], type);
    }
  };

  const handleTopUpload = async (e) => {
    e.preventDefault();
    if (!newTopImage) return;

    const formData = new FormData();
    formData.append("image", newTopImage);

    try {
      setLoading(true);
      const res = await api.post("/api/home-slider-top/", formData);
      setTopSlides([...topSlides, res.data]);
      setNewTopImage(null);
      setPreviewUrls(prev => ({ ...prev, top: null }));
      e.target.reset();
    } catch (err) {
      setError("Error uploading top image");
      console.error("Error uploading top image:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBottomUpload = async (e) => {
    e.preventDefault();
    if (!newBottomImage) return;

    const formData = new FormData();
    formData.append("image", newBottomImage);

    try {
      setLoading(true);
      const res = await api.post("/api/home-slider-bottom/", formData);
      setBottomSlides([...bottomSlides, res.data]);
      setNewBottomImage(null);
      setPreviewUrls(prev => ({ ...prev, bottom: null }));
      e.target.reset();
    } catch (err) {
      setError("Error uploading bottom image");
      console.error("Error uploading bottom image:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTop = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/home-slider-top/${id}/`);
      setTopSlides(topSlides.filter((s) => s.id !== id));
    } catch (err) {
      setError("Error deleting top slide");
      console.error("Error deleting top slide:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBottom = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/home-slider-bottom/${id}/`);
      setBottomSlides(bottomSlides.filter((s) => s.id !== id));
    } catch (err) {
      setError("Error deleting bottom slide");
      console.error("Error deleting bottom slide:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearPreview = (type) => {
    setPreviewUrls(prev => ({ ...prev, [type]: null }));
    if (type === 'top') {
      setNewTopImage(null);
    } else {
      setNewBottomImage(null);
    }
  };

  const getImageUrl = (imagePath) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
    return imagePath.startsWith("http")
      ? imagePath
      : `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  const SliderSection = ({ title, slides, onUpload, onDelete, newImage, onImageChange, previewUrl, dragActive, type }) => (
    <div className="slider-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <div className="slide-count">
          <span>{slides.length} image{slides.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Upload Form */}
      {isAdmin && (
        <div className="upload-card">
          <form onSubmit={onUpload} className="upload-form">
            <div 
              className={`drop-zone ${dragActive ? 'drag-active' : ''} ${previewUrl ? 'has-preview' : ''}`}
              onDragEnter={(e) => handleDrag(e, type)}
              onDragLeave={(e) => handleDrag(e, type)}
              onDragOver={(e) => handleDrag(e, type)}
              onDrop={(e) => handleDrop(e, type)}
            >
              {previewUrl ? (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                  <button
                    type="button"
                    className="clear-preview"
                    onClick={() => clearPreview(type)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="drop-content">
                  <div className="drop-icon">
                    <Upload size={32} />
                  </div>
                  <div className="drop-text">
                    <p className="main-text">Drag & drop your image here</p>
                    <p className="sub-text">or click to browse</p>
                    <p className="format-text">PNG, JPG, JPEG (max 10MB)</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => onImageChange(e.target.files[0], type)}
                className="file-input"
              />
            </div>
            
            {newImage && (
              <button type="submit" className="upload-btn" disabled={loading}>
                <Plus size={16} />
                <span>{loading ? 'Uploading...' : `Upload ${type === 'top' ? 'Top' : 'Bottom'} Image`}</span>
              </button>
            )}
          </form>
        </div>
      )}

      {/* Slides Grid */}
      <div className="slides-container">
        {loading && slides.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading slides...</p>
          </div>
        ) : slides.length > 0 ? (
          <div className="slides-grid">
            {slides.map((slide) => (
              <div key={slide.id} className="slide-card">
                <div className="image-container">
                  <img
                    src={getImageUrl(slide.image)}
                    alt={`${type} Slide ${slide.id}`}
                    className="slide-image"
                    onError={(e) => {
                      e.target.src = "/fallback-image.png";
                      e.target.onerror = null;
                    }}
                  />
                  {/* Delete button - Now always visible */}
                  {isAdmin && (
                    <button
                      className="delete-btn-always-visible"
                      onClick={() => onDelete(slide.id)}
                      title="Delete image"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="slide-info">
                  <span className="slide-id">ID: {slide.id}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <ImageIcon size={48} />
            </div>
            <h3>No images uploaded</h3>
            <p>Upload your first image to get started</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-home-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Home Slider Management</h1>
          <p className="page-subtitle">Manage your homepage slider images</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button className="error-close" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Slider Section */}
      <SliderSection
        title="Top Slider"
        slides={topSlides}
        onUpload={handleTopUpload}
        onDelete={handleDeleteTop}
        newImage={newTopImage}
        onImageChange={handleImageChange}
        previewUrl={previewUrls.top}
        dragActive={dragActive.top}
        type="top"
      />

      {/* Bottom Slider Section */}
      <SliderSection
        title="Bottom Slider"
        slides={bottomSlides}
        onUpload={handleBottomUpload}
        onDelete={handleDeleteBottom}
        newImage={newBottomImage}
        onImageChange={handleImageChange}
        previewUrl={previewUrls.bottom}
        dragActive={dragActive.bottom}
        type="bottom"
      />
    </div>
  );
};

export default AdminHome;
