// src/pages/Signup.jsx
import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", {
        firstName,
        lastName,
        email,
        contact,
        password,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Signup success:", response.data);
      setSuccess("Signup successful! Redirecting to login...");
      setError(null);
      // Store userId for reference (optional, can use token instead)
      localStorage.setItem("userId", response.data.userId);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Failed to sign up. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8f9fa" }}>
      <Card style={{ padding: "2rem", width: "100%", maxWidth: "500px" }} className="shadow">
        <h3 className="text-center mb-4">Create your SmartFin Account</h3>
        <Form onSubmit={handleSignup}>
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
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <div className="d-grid">
            <Button variant="success" type="submit">Sign Up</Button>
          </div>
        </Form>
        <p className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></p>
      </Card>
    </div>
  );
};

export default Signup;