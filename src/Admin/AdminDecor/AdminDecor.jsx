import { useState, useEffect } from "react";
import api from "../../Api";
import "./AdminDecor.scss";

const AdminDecor = () => {
  const [decorImages, setDecorImages] = useState({ image1: null, image2: null, image3: null });
  const [newImages, setNewImages] = useState({ image1: null, image2: null, image3: null });
  const [previews, setPreviews] = useState({ image1: null, image2: null, image3: null });
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAdmin(token ? true : false);
  }, []);

  // Fetch decor images
  useEffect(() => {
    api
      .get("/api/decor/")
      .then((response) => {
        // Use the second result (id: 2) which contains valid image URLs
        const validDecor = response.data.results.find((item) => item.id === 1) || {
          image1: null,
          image2: null,
          image3: null,
        };
        setDecorImages(validDecor);
      })
      .catch((error) => console.error("Error fetching decor images:", error));
  }, []);

  // Handle image selection and generate previews
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setNewImages({ ...newImages, [field]: file });
      const previewUrl = URL.createObjectURL(file);
      setPreviews({ ...previews, [field]: previewUrl });
    }
  };

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((preview) => {
        if (preview) URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  // Handle individual image upload
  const handleImageUpload = async (e, field) => {
    e.preventDefault();
    const formData = new FormData();
    if (newImages[field]) formData.append(field, newImages[field]);

    try {
      const response = await api.patch(`/api/decor/2/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDecorImages(response.data);
      setNewImages({ ...newImages, [field]: null });
      setPreviews({ ...previews, [field]: null });
    } catch (error) {
      console.error(`Error uploading ${field}:`, error);
    }
  };

  return (
    <div className="adminDecorContainer">
      <h2 className="adminDecorTitle">Decor</h2>
      <div className="adminDecorGrid">
        {["image1", "image2", "image3"].map((field, index) => (
          <div key={field} className="adminDecorItem">
            <svg
              width="268"
              height="518"
              viewBox="0 0 268 518"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
                href={previews[field] || (decorImages[field] ? decorImages[field] : "/placeholder-image.jpg")}
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
          </div>
        ))}
      </div>
      {isAdmin && (
        <div className="adminFormContainer">
          {["image1", "image2", "image3"].map((field) => (
            <form key={field} className="adminForm" onSubmit={(e) => handleImageUpload(e, field)}>
              <div className="formItem">
                {previews[field] && (
                  <img
                    src={previews[field]}
                    alt={`Preview ${field}`}
                    className="previewImage"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, field)}
                  className="fileInput"
                />
                <button type="submit" className="uploadButton">
                  Upload {field.charAt(0).toUpperCase() + field.slice(1)}
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDecor;