// src/pages/Login.jsx
import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Login success:", response.data);
      const { token, userId } = response.data;
      localStorage.setItem("token", token); // Store JWT token
      localStorage.setItem("userId", userId); // Store userId
      setSuccess("Login successful! Redirecting...");
      setError(null);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Invalid credentials. Please try again.");
      setSuccess(null);
    }
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Button
        variant="link"
        style={{ position: "absolute", top: "20px", left: "20px", textDecoration: "none", fontWeight: "bold" }}
        onClick={handleGoBack}
      >
        ← Go back to Dashboard
      </Button>
      <Card style={{ padding: "2rem", width: "100%", maxWidth: "400px" }} className="shadow">
        <h3 className="text-center mb-4">Login to SmartFin</h3>
        <Form onSubmit={handleLogin}>
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
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <div className="d-grid">
            <Button variant="primary" type="submit">Login</Button>
          </div>
        </Form>
        <div className="text-center mt-3">
          <p>Don’t have an account? <Link to="/signup">Sign up here</Link></p>
        </div>
      </Card>
    </div>
  );
};

export default Login;