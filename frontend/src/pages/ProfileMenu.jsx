import React, { useState, useRef, useEffect } from 'react';
import './ProfileMenu.css';
import profileIcon from './assets/profile-icon.png'; // replace with your PNG/SVG icon

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="profile-container" ref={menuRef}>
      <img
        src={profileIcon}
        alt="Profile"
        className="profile-icon"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="profile-dropdown">
          <p className="dropdown-item">Change Profile Picture</p>
          <p className="dropdown-item">Change Passport</p>
          {/* Future Options */}
          {/* <p className="dropdown-item">Edit Income</p> */}
          {/* <p className="dropdown-item">Edit Expenses</p> */}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
