import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", { email, password });
    alert("Login submitted");
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
      {/* Top-left "Go Back" button */}
      <Button
        variant="link"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
        onClick={handleGoBack}
      >
        ← Go back to Dashboard
      </Button>

      {/* Login Form Card */}
      <Card
        style={{ padding: "2rem", width: "100%", maxWidth: "400px" }}
        className="shadow"
      >
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

          <div className="d-grid">
            <Button variant="primary" type="submit">
              Login
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <p>
            Don’t have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
