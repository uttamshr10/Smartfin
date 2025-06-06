import React from 'react';
import './Contact.css';
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-card">
        {/* Left side: contact info */}
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p><FaMapMarkerAlt /> Jawalakhel, Lalitpur</p>
          <p><FaPhone /> +977 9818 7700 12</p>

          <h3>Opening Hours</h3>
          <p><FaClock /> 9:00am–6pm, Mon–Fri</p>
        </div>

        {/* Right side: contact form */}
       <form 
  action="https://formsubmit.co/sijapatipratik576@gmail.com" 
  method="POST" 
  className="contact-form"
>
  <input type="text" name="name" placeholder="Your name" required />
  <input type="email" name="email" placeholder="Your email" required />
  <textarea name="message" placeholder="Your message here" rows="5" required />
  
  {/* Optional: prevent spam */}
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_template" value="box" />

  <button type="submit">Submit</button>
</form>

      </div>
    </div>
  );
};

export default Contact;
