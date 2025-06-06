import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-card">
        <div className="about-text">
          <h2>About Us</h2>
          <p>
            At <strong>SmartFin</strong>, we are committed to transforming the way individuals manage their personal finances. As a trusted digital finance companion, we offer a suite of intelligent tools designed to simplify budgeting, track expenses, and automate savings. 
            <br /><br />
            Our platform is built on innovation and usability, combining AI-driven insights with a user-friendly dashboard. Whether you're a student or a working professional, SmartFin empowers you to take control of your financial journey.
            <br /><br />
            <strong>Join SmartFin and unlock the smarter way to save and grow your money.</strong>
          </p>
        </div>

        <div className="about-image">
          <img src="/images/about-illustration.png" alt="Team illustration" />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
