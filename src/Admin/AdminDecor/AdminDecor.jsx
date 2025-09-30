import { useState, useEffect } from "react";
import { Upload, X, Eye, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import api from "../../Api";
import "./AdminDecor.scss";

const AdminDecor = () => {
  const [decorImages, setDecorImages] = useState({ image1: null, image2: null, image3: null });
  const [newImages, setNewImages] = useState({ image1: null, image2: null, image3: null });
  const [previews, setPreviews] = useState({ image1: null, image2: null, image3: null });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragActive, setDragActive] = useState({ image1: false, image2: false, image3: false });
  const [previewModal, setPreviewModal] = useState({ open: false, image: null, title: "" });

  // Check admin status
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAdmin(!!token);
  }, []);

  // Fetch decor images
  useEffect(() => {
    fetchDecorImages();
  }, []);

  const fetchDecorImages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/decor/");
      const validDecor = response.data.results.find((item) => item.id === 1) || {
        image1: null,
        image2: null,
        image3: null,
      };
      setDecorImages(validDecor);
    } catch (error) {
      setError("Error fetching decor images");
      console.error("Error fetching decor images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection and generate previews
  const handleImageChange = (file, field) => {
    if (file && file.type.startsWith('image/')) {
      setNewImages({ ...newImages, [field]: file });
      const previewUrl = URL.createObjectURL(file);
      setPreviews({ ...previews, [field]: previewUrl });
      setError("");
    } else {
      setError("Please select a valid image file");
    }
  };

  // Handle drag and drop
  const handleDrag = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive({ ...dragActive, [field]: true });
    } else if (e.type === "dragleave") {
      setDragActive({ ...dragActive, [field]: false });
    }
  };

  const handleDrop = (e, field) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({ ...dragActive, [field]: false });
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0], field);
    }
  };

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((preview) => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [previews]);

  // Handle individual image upload
  const handleImageUpload = async (e, field) => {
    e.preventDefault();
    if (!newImages[field]) return;

    const formData = new FormData();
    formData.append(field, newImages[field]);

    try {
      setLoading(true);
      const response = await api.patch(`/api/decor/1/`, formData);
      setDecorImages(response.data);
      setNewImages({ ...newImages, [field]: null });
      setPreviews({ ...previews, [field]: null });
      setSuccess(`${getFieldLabel(field)} updated successfully`);
    } catch (error) {
      setError(`Error uploading ${getFieldLabel(field)}`);
      console.error(`Error uploading ${field}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image deletion
  const handleImageDelete = async (field) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append(field, ''); // Send empty value to delete
      const response = await api.patch(`/api/decor/1/`, formData);
      setDecorImages(response.data);
      setSuccess(`${getFieldLabel(field)} deleted successfully`);
    } catch (error) {
      setError(`Error deleting ${getFieldLabel(field)}`);
      console.error(`Error deleting ${field}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const clearNewImage = (field) => {
    setNewImages({ ...newImages, [field]: null });
    if (previews[field] && previews[field].startsWith('blob:')) {
      URL.revokeObjectURL(previews[field]);
    }
    setPreviews({ ...previews, [field]: null });
  };

  const getFieldLabel = (field) => {
    const labels = {
      image1: "Decor Image 1",
      image2: "Decor Image 2", 
      image3: "Decor Image 3"
    };
    return labels[field] || field;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http") ? imagePath : `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  const openPreviewModal = (image, title) => {
    setPreviewModal({ open: true, image, title });
  };

  // Auto-dismiss messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="admin-decor-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Decor Management</h1>
          <p className="page-subtitle">Manage decorative bottle-shaped images</p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="message-banner error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button className="message-close" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="message-banner success-banner">
          <CheckCircle size={20} />
          <span>{success}</span>
          <button className="message-close" onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Decor Display Grid */}
      <div className="content-card">
        <div className="card-header">
          <h3>Decor Images</h3>
        </div>

        <div className="decor-display-section">
          {loading && Object.values(decorImages).every(img => !img) ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading decor images...</p>
            </div>
          ) : (
            <div className="decor-grid">
              {["image1", "image2", "image3"].map((field, index) => {
                const currentImage = getImageUrl(decorImages[field]);
                const previewImage = previews[field];
                const displayImage = previewImage || currentImage;

                return (
                  <div key={field} className="decor-item">
                    <div className="bottle-container">
                      <svg
                        width="268"
                        height="518"
                        viewBox="0 0 268 518"
                        className="bottle-svg"
                      >
                        <defs>
                          <mask id={`bottleMask${index}`}>
                            <rect width="100%" height="100%" fill="black" />
                            <path
                              d="M236.357 228.351C246.346 207.121 251.957 183.416 251.957 158.394C251.957 83.7276 202.132 20.7141 134 1C65.8683 20.7141 16.0431 83.7276 16.0431 158.394C16.0431 183.416 21.6544 207.121 31.6433 228.351C14.5706 229.429 1 243.676 1 261.075V517H267V261.075C267 243.676 253.469 229.429 236.357 228.351Z"
                              fill="white"
                            />
                          </mask>
                        </defs>

                        <image
                          href={displayImage || "/placeholder-image.jpg"}
                          x="1"
                          y="1"
                          width="266"
                          height="516"
                          preserveAspectRatio="xMidYMid slice"
                          mask={`url(#bottleMask${index})`}
                        />

                        <path
                          d="M236.357 228.351C246.346 207.121 251.957 183.416 251.957 158.394C251.957 83.7276 202.132 20.7141 134 1C65.8683 20.7141 16.0431 83.7276 16.0431 158.394C16.0431 183.416 21.6544 207.121 31.6433 228.351C14.5706 229.429 1 243.676 1 261.075V517H267V261.075C267 243.676 253.469 229.429 236.357 228.351Z"
                          stroke="#F4DBBB"
                          strokeWidth="2"
                          fill="none"
                          strokeMiterlimit="10"
                        />
                      </svg>

                      {/* Action Buttons */}
                      <div className="bottle-actions">
                        {displayImage && (
                          <button
                            className="action-btn preview-btn"
                            onClick={() => openPreviewModal(displayImage, getFieldLabel(field))}
                            title="View full size"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        {isAdmin && currentImage && (
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleImageDelete(field)}
                            title="Delete image"
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="item-info">
                      <h4>{getFieldLabel(field)}</h4>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upload Forms */}
      {isAdmin && (
        <div className="upload-section">
          <div className="upload-grid">
            {["image1", "image2", "image3"].map((field) => (
              <div key={field} className="upload-card">
                <div className="upload-header">
                  <h4>{getFieldLabel(field)}</h4>
                </div>

                <form onSubmit={(e) => handleImageUpload(e, field)} className="upload-form">
                  {/* Drop Zone */}
                  <div 
                    className={`drop-zone ${dragActive[field] ? 'drag-active' : ''} ${newImages[field] ? 'has-preview' : ''}`}
                    onDragEnter={(e) => handleDrag(e, field)}
                    onDragLeave={(e) => handleDrag(e, field)}
                    onDragOver={(e) => handleDrag(e, field)}
                    onDrop={(e) => handleDrop(e, field)}
                  >
                    {newImages[field] ? (
                      <div className="preview-container">
                        <div className="preview-bottle">
                          <svg width="120" height="232" viewBox="0 0 268 518" className="preview-svg">
                            <defs>
                              <mask id={`previewMask${field}`}>
                                <rect width="100%" height="100%" fill="black" />
                                <path
                                  d="M236.357 228.351C246.346 207.121 251.957 183.416 251.957 158.394C251.957 83.7276 202.132 20.7141 134 1C65.8683 20.7141 16.0431 83.7276 16.0431 158.394C16.0431 183.416 21.6544 207.121 31.6433 228.351C14.5706 229.429 1 243.676 1 261.075V517H267V261.075C267 243676 253.469 229.429 236.357 228.351Z"
                                  fill="white"
                                />
                              </mask>
                            </defs>
                            <image
                              href={previews[field]}
                              x="1"
                              y="1"
                              width="266"
                              height="516"
                              preserveAspectRatio="xMidYMid slice"
                              mask={`url(#previewMask${field})`}
                            />
                            <path
                              d="M236.357 228.351C246.346 207.121 251.957 183.416 251.957 158.394C251.957 83.7276 202.132 20.7141 134 1C65.8683 20.7141 16.0431 83.7276 16.0431 158.394C16.0431 183.416 21.6544 207.121 31.6433 228.351C14.5706 229.429 1 243.676 1 261.075V517H267V261.075C267 243.676 253.469 229.429 236.357 228.351Z"
                              stroke="#F4DBBB"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        </div>
                        <button
                          type="button"
                          className="clear-preview"
                          onClick={() => clearNewImage(field)}
                        >
                          <X size={16} />
                        </button>
                        <div className="file-info">
                          <p className="file-name">{newImages[field].name}</p>
                          <p className="file-size">{(newImages[field].size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="drop-content">
                        <div className="drop-icon">
                          <Upload size={32} />
                        </div>
                        <div className="drop-text">
                          <p className="main-text">Drop image here</p>
                          <p className="sub-text">or click to browse</p>
                          <p className="format-text">PNG, JPG, JPEG</p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={(e) => handleImageChange(e.target.files[0], field)}
                      className="file-input"
                    />
                  </div>

                  {/* Upload Button */}
                  {newImages[field] && (
                    <button
                      type="submit"
                      className="upload-btn"
                      disabled={loading}
                    >
                      <Upload size={16} />
                      <span>{loading ? 'Uploading...' : 'Upload Image'}</span>
                    </button>
                  )}
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModal.open && (
        <div className="modal-overlay" onClick={() => setPreviewModal({ open: false, image: null, title: "" })}>
          <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{previewModal.title}</h3>
              <button
                className="modal-close"
                onClick={() => setPreviewModal({ open: false, image: null, title: "" })}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-bottle-container">
                <svg width="400" height="774" viewBox="0 0 268 518" className="modal-bottle-svg">
                  <defs>
                    <mask id="modalBottleMask">
                      <rect width="100%" height="100%" fill="black" />
                      <path
                        d="M236.357 228.351C246.346 207.121 251.957 183.416 251.957 158.394C251.957 83.7276 202.132 20.7141 134 1C65.8683 20.7141 16.0431 83.7276 16.0431 158.394C16.0431 183.416 21.6544 207.121 31.6433 228.351C14.5706 229.429 1 243.676 1 261.075V517H267V261.075C267 243.676 253.469 229.429 236.357 228.351Z"
                        fill="white"
                      />
                    </mask>
                  </defs>
                  <image
                    href={previewModal.image}
                    x="1"
                    y="1"
                    width="266"
                    height="516"
                    preserveAspectRatio="xMidYMid slice"
                    mask="url(#modalBottleMask)"
                  />
                  <path
                    d="M236.357 228.351C246.346 207.121 251.957 183.416 251.957 158.394C251.957 83.7276 202.132 20.7141 134 1C65.8683 20.7141 16.0431 83.7276 16.0431 158.394C16.0431 183.416 21.6544 207.121 31.6433 228.351C14.5706 229.429 1 243.676 1 261.075V517H267V261.075C267 243.676 253.469 229.429 236.357 228.351Z"
                    stroke="#F4DBBB"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDecor;
