import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import { Link } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState("");
  const [profession, setProfession] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    const formData = new FormData(); // Create FormData to send file
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("dob", dob);
    formData.append("profession", profession);
    formData.append("password", password);
    if (profilePic) formData.append("profilePic", profilePic); // If profile pic exists

    try {
      // Send POST request to backend to create a new user
      const response = await axios.post("http://localhost:3000/api/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Tell backend we're sending a file
        },
      });

      // Handle success
      console.log("Signup success:", response.data);
      setSuccess("Signup successful! Redirecting...");
      setError(null);

      // Redirect user to profile page (or anywhere else you want)
      setTimeout(() => navigate("/profile"), 2000); // Redirect to '/profile' after 2 seconds
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to sign up. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Card
        style={{ padding: "2rem", width: "100%", maxWidth: "500px" }}
        className="shadow"
      >
        <h3 className="text-center mb-4">Create your SmartFin Account</h3>
        <Form onSubmit={handleSignup}>
          {/* Form fields */}
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contact</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profession</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Profile picture upload */}
          <Form.Group className="mb-3">
            <Form.Label>Profile Picture</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
          </Form.Group>

          {/* Error and success messages */}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="d-grid">
            <Button variant="success" type="submit">
              Sign Up
            </Button>
          </div>
        </Form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Signup;
