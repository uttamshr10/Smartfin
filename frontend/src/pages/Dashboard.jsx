import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';
import DashboardForm from './DashboardForm';
import './SpaceLanding.css';
import { Modal } from 'react-bootstrap'; // Ensure you have this import

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // Modal state
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    profilePic: '', // Default empty, will be updated after login
  });

  useEffect(() => {
    // Fetch profile data from localStorage if it exists
    const userData = localStorage.getItem('user');
    if (userData) {
      setProfileData(JSON.parse(userData));
    }
  }, []); // Only run on component mount (once)

  const handleStartSaving = () => setShowForm(true);
  
  // Handle profile icon click
  const handleProfileClick = () => {
    console.log("Profile icon clicked!"); // Log to verify click
    setShowProfileModal((prevState) => !prevState); // Toggle modal
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false); // Close the modal
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevState) => ({
          ...prevState,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (newPassword) => {
    console.log('Password changed to:', newPassword);
  };

  // Log state in render to check modal state
  console.log("Show Profile Modal State: ", showProfileModal);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {/* Profile Icon */}
        <div className="profile-icon" onClick={handleProfileClick}>
          <img
            src={profileData.profilePic ? profileData.profilePic : 'defaultPic.jpg'} // Fallback if profile pic is missing
            alt="Profile Icon"
            className="profile-icon-img"
          />
        </div>

        {/* Profile Modal */}
        <Modal show={showProfileModal} onHide={handleCloseProfileModal}>
          <Modal.Header closeButton>
            <Modal.Title>Profile Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="profile-details">
              <img
                src={profileData.profilePic ? profileData.profilePic : 'defaultPic.jpg'}
                alt="Profile"
                className="profile-img"
              />
              <input type="file" onChange={handleProfilePicChange} />
              <div>
                <strong>Username:</strong> {profileData.username}
              </div>
              <div>
                <strong>Email:</strong> {profileData.email}
              </div>
              <div>
                <strong>Change Password:</strong>
                <input
                  type="password"
                  placeholder="New Password"
                  onBlur={(e) => handlePasswordChange(e.target.value)}
                />
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* Landing Section */}
        {location.pathname === "/dashboard" && !showForm && (
          <div className="space-landing">
            <h1>DO WHAT YOU DO BEST,<br />WE'LL HANDLE THE REST</h1>
            <p>We specialize in designing and developing, auditing, and supporting products.</p>
            <button className="start-saving-btn" onClick={handleStartSaving}>Start Saving</button>
          </div>
        )}
        
        {/* Dashboard Form */}
        {location.pathname === "/dashboard" && showForm && <DashboardForm />}

        {/* Dynamic Routing */}
        {location.pathname !== "/dashboard" && <Outlet />}
      </div>
    </div>
  );
};

export default Dashboard;
