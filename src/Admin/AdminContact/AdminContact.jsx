import { useState, useEffect } from "react";
import api from "../../Api";
import "./AdminContact.scss";

const AdminContact = () => {
  const [contactInfoList, setContactInfoList] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    email: "",
    working_hours: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAdmin(!!token);
  }, []);

  // Fetch contact info
  useEffect(() => {
    api
      .get("/api/contact/")
      .then((response) => {
        const data = response.data?.results || response.data || [];
        setContactInfoList(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching contact info:", error);
        setError("Failed to load contact information.");
      });
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        const response = await api.put(`/api/contact/${editingId}/`, formData);
        setContactInfoList((prev) =>
          prev.map((item) => (item.id === editingId ? response.data : item))
        );
        setSuccess("Contact information updated successfully.");
        setEditingId(null);
        setFormData({
          address: "",
          phone: "",
          email: "",
          working_hours: "",
        });
      }
    } catch (error) {
      console.error("Error updating contact info:", error);
      setError("Failed to update contact information.");
    }
  };

  // Handle edit button click
  const handleEdit = (contact) => {
    setFormData({
      address: contact.address || "",
      phone: contact.phone || "",
      email: contact.email || "",
      working_hours: contact.working_hours || "",
    });
    setEditingId(contact.id);
    setError(null);
    setSuccess(null);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      address: "",
      phone: "",
      email: "",
      working_hours: "",
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="adminContactContainer">
      <h2 className="adminContactTitle">Contact Us</h2>
      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}
      {contactInfoList.length > 0 ? (
        <div className="adminContactInfo">
          {contactInfoList.map((contact) => (
            <div key={contact.id} className="contactItem">
              <input
                type="text"
                value={contact.address}
                disabled
                className="formInput"
              />
              <input
                type="text"
                value={contact.phone}
                disabled
                className="formInput"
              />
              <input
                type="email"
                value={contact.email}
                disabled
                className="formInput"
              />
              <input
                type="text"
                value={contact.working_hours}
                disabled
                className="formInput"
              />
              {isAdmin && (
                <button
                  onClick={() => handleEdit(contact)}
                  className="editButton"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No contact information available.</p>
      )}
      {isAdmin && editingId && (
        <form className="adminForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="formInput"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="formInput"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="formInput"
            required
          />
          <input
            type="text"
            name="working_hours"
            value={formData.working_hours}
            onChange={handleChange}
            placeholder="Working Hours"
            className="formInput"
            required
          />
          <div className="formButtons">
            <button type="submit" className="updateButton">
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="cancelButton"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminContact;