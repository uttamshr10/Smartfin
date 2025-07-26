import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:3000/api/auth/signup", {
      name: fullName, // ✅ this matches the backend field
      email,
      contact,
      dob,
      password,
    });

    console.log("Signup success:", response.data);
    setSuccess("Signup successful! Redirecting...");
    setError(null);
    setTimeout(() => navigate("/login"), 2000);
  } catch (err) {
    console.error("Signup error:", err);
    setError(err.response?.data?.message || "Failed to sign up. Please try again.");
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
      <Card style={{ padding: "2rem", width: "100%", maxWidth: "500px" }} className="shadow">
        <h3 className="text-center mb-4">Create your SmartFin Account</h3>
        <Form onSubmit={handleSignup}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
