import { useState, useEffect } from "react";
import { Edit, Save, X, AlertCircle, CheckCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAdmin(!!token);
  }, []);

  // Fetch contact info
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/contact/");
      const data = response.data?.results || response.data || [];
      setContactInfoList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      setError("Failed to load contact information.");
    } finally {
      setLoading(false);
    }
  };

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
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  // Auto-dismiss success/error messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const getContactIcon = (type) => {
    switch (type) {
      case 'address': return <MapPin size={20} />;
      case 'phone': return <Phone size={20} />;
      case 'email': return <Mail size={20} />;
      case 'working_hours': return <Clock size={20} />;
      default: return null;
    }
  };

  const getContactLabel = (type) => {
    switch (type) {
      case 'address': return 'Address';
      case 'phone': return 'Phone Number';
      case 'email': return 'Email Address';
      case 'working_hours': return 'Working Hours';
      default: return type;
    }
  };

  return (
    <div className="admin-contact-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Contact Information</h1>
          <p className="page-subtitle">Manage your business contact details</p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="message-banner error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button className="message-close" onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="message-banner success-banner">
          <CheckCircle size={20} />
          <span>{success}</span>
          <button className="message-close" onClick={() => setSuccess(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Contact Information Display */}
      <div className="content-card">
        <div className="card-header">
          <h3>Current Contact Information</h3>
          {contactInfoList.length > 0 && (
            <div className="contact-count">
              <span>{contactInfoList.length} contact{contactInfoList.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="contact-info-section">
          {loading && contactInfoList.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading contact information...</p>
            </div>
          ) : contactInfoList.length > 0 ? (
            <div className="contact-list">
              {contactInfoList.map((contact) => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-details">
                    <div className="contact-item">
                      <div className="contact-item-header">
                        <div className="contact-icon">
                          {getContactIcon('address')}
                        </div>
                        <span className="contact-label">Address</span>
                      </div>
                      <p className="contact-value">{contact.address || 'Not provided'}</p>
                    </div>

                    <div className="contact-item">
                      <div className="contact-item-header">
                        <div className="contact-icon">
                          {getContactIcon('phone')}
                        </div>
                        <span className="contact-label">Phone Number</span>
                      </div>
                      <p className="contact-value">{contact.phone || 'Not provided'}</p>
                    </div>

                    <div className="contact-item">
                      <div className="contact-item-header">
                        <div className="contact-icon">
                          {getContactIcon('email')}
                        </div>
                        <span className="contact-label">Email Address</span>
                      </div>
                      <p className="contact-value">{contact.email || 'Not provided'}</p>
                    </div>

                    <div className="contact-item">
                      <div className="contact-item-header">
                        <div className="contact-icon">
                          {getContactIcon('working_hours')}
                        </div>
                        <span className="contact-label">Working Hours</span>
                      </div>
                      <p className="contact-value">{contact.working_hours || 'Not provided'}</p>
                    </div>
                  </div>

                  {isAdmin && !editingId && (
                    <div className="contact-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(contact)}
                        title="Edit contact information"
                      >
                        <Edit size={16} />
                        <span>Edit</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Phone size={48} />
              </div>
              <h3>No contact information</h3>
              <p>Contact information will appear here once added</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {isAdmin && editingId && (
        <div className="content-card edit-form-card">
          <div className="card-header">
            <h3>Edit Contact Information</h3>
          </div>

          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">
                  <div className="label-content">
                    {getContactIcon('address')}
                    <span>Address</span>
                  </div>
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter business address"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <div className="label-content">
                    {getContactIcon('phone')}
                    <span>Phone Number</span>
                  </div>
                  <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <div className="label-content">
                    {getContactIcon('email')}
                    <span>Email Address</span>
                  </div>
                  <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="input-field"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">
                  <div className="label-content">
                    {getContactIcon('working_hours')}
                    <span>Working Hours</span>
                  </div>
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="working_hours"
                  value={formData.working_hours}
                  onChange={handleChange}
                  placeholder="e.g., Mon-Fri: 9:00 AM - 6:00 PM"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                <Save size={16} />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminContact;
