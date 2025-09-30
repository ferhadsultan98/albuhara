import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, AlertCircle, X, Eye, Trash2 } from "lucide-react";
import api from "../../Api";
import "./AdminAbout.scss";

const AdminAbout = () => {
  const [aboutImage, setAboutImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Check admin status
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAdmin(!!token);
  }, []);

  // Fetch about section
  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/about-section/");
      if (response.data.results?.length > 0) {
        setAboutImage(response.data.results[0]);
      }
    } catch (error) {
      setError("Error fetching about section");
      console.error("Error fetching about section:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setNewImage(file);
      setError("");
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  // Handle image update
  const handleImageUpdate = async (e) => {
    e.preventDefault();
    if (!newImage) return;

    const formData = new FormData();
    formData.append("image", newImage);

    try {
      setLoading(true);
      let response;
      if (aboutImage?.id) {
        response = await api.put(`/api/about-section/${aboutImage.id}/`, formData);
      } else {
        response = await api.post(`/api/about-section/`, formData);
      }
      setAboutImage(response.data);
      setNewImage(null);
      setError("");
    } catch (error) {
      setError("Error saving image");
      console.error("Error saving image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!aboutImage?.id) return;
    
    try {
      setLoading(true);
      await api.delete(`/api/about-section/${aboutImage.id}/`);
      setAboutImage(null);
      setPreview(null);
      setError("");
    } catch (error) {
      setError("Error deleting image");
      console.error("Error deleting image:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearNewImage = () => {
    setNewImage(null);
    setError("");
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http") ? imagePath : `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  return (
    <div className="admin-about-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">About Section Management</h1>
          <p className="page-subtitle">Manage your about section image</p>
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

      {/* Current Image Display */}
      <div className="content-card">
        <div className="card-header">
          <h3>Current About Image</h3>
          {aboutImage && (
            <div className="image-actions">
              <button
                className="action-btn preview-btn"
                onClick={() => setShowPreviewModal(true)}
                title="View full size"
              >
                <Eye size={16} />
              </button>
              {isAdmin && (
                <button
                  className="action-btn delete-btn"
                  onClick={handleDelete}
                  title="Delete image"
                  disabled={loading}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="image-display-section">
          {loading && !aboutImage ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading image...</p>
            </div>
          ) : preview ? (
            <div className="current-image-container">
              <img
                src={preview}
                alt="About Section"
                className="current-image"
                onError={(e) => {
                  e.target.src = "/fallback-image.png";
                  e.target.onerror = null;
                }}
              />
              <div className="image-overlay">
                <button
                  className="overlay-btn"
                  onClick={() => setShowPreviewModal(true)}
                >
                  <Eye size={20} />
                  <span>View Full Size</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="no-image-state">
              <div className="no-image-icon">
                <ImageIcon size={64} />
              </div>
              <h3>No image uploaded</h3>
              <p>Upload an image to display in your about section</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Section */}
      {isAdmin && (
        <div className="content-card">
          <div className="card-header">
            <h3>{aboutImage ? 'Update Image' : 'Upload New Image'}</h3>
          </div>

          <form onSubmit={handleImageUpdate} className="upload-form">
            {/* Drop Zone */}
            <div 
              className={`drop-zone ${dragActive ? 'drag-active' : ''} ${newImage ? 'has-preview' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {newImage ? (
                <div className="preview-container">
                  <img 
                    src={URL.createObjectURL(newImage)} 
                    alt="Preview" 
                    className="preview-image" 
                  />
                  <button
                    type="button"
                    className="clear-preview"
                    onClick={clearNewImage}
                  >
                    <X size={16} />
                  </button>
                  <div className="preview-info">
                    <p className="file-name">{newImage.name}</p>
                    <p className="file-size">{(newImage.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="drop-content">
                  <div className="drop-icon">
                    <Upload size={40} />
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
                onChange={(e) => handleImageChange(e.target.files[0])}
                className="file-input"
              />
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              {newImage && (
                <>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={clearNewImage}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="upload-btn"
                    disabled={loading}
                  >
                    <Upload size={16} />
                    <span>{loading ? 'Updating...' : (aboutImage ? 'Update Image' : 'Upload Image')}</span>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && preview && (
        <div className="modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>About Section Image</h3>
              <button
                className="modal-close"
                onClick={() => setShowPreviewModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <img
                src={preview}
                alt="About Section Full Size"
                className="modal-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;
