import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
  email,
  password,
});

      // Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    }
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

          {error && <div className="alert alert-danger">{error}</div>}

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
const handleLogin = (event) => {
  event.preventDefault();

  // Dummy profile data for example purposes
  const userData = {
    username: 'JohnDoe',
    email: 'johndoe@example.com',
    profilePic: 'defaultPic.jpg', // Or store a base64 image or URL
  };

  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(userData));

  // Redirect to dashboard after successful login
  navigate('/dashboard');
};

export default Login;
