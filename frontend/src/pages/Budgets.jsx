// src/pages/Budgets.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Budgets = () => {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [month, setMonth] = useState("");
  // New fields
  const [goalId, setGoalId] = useState("");
  const [targetSavings, setTargetSavings] = useState("");
  const [deadline, setDeadline] = useState("");
  const [allocatedSavings, setAllocatedSavings] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch goals for dropdown (assuming a /api/goals endpoint)
  const [goals, setGoals] = useState([]);
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(response.data);
      } catch (err) {
        console.error("Error fetching goals:", err);
      }
    };
    fetchGoals();
  }, []);

  // Fetch user's budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/budgets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBudgets(response.data);
      } catch (err) {
        setError("Failed to load budgets");
      }
    };
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/budgets",
        { category, limit: parseFloat(limit), month, goalId, targetSavings: parseFloat(targetSavings), deadline, allocatedSavings: parseFloat(allocatedSavings) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudgets([...budgets, response.data]);
      setSuccess("Budget created successfully!");
      setCategory("");
      setLimit("");
      setMonth("");
      setGoalId("");
      setTargetSavings("");
      setDeadline("");
      setAllocatedSavings("");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create budget");
      setSuccess(null);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Budgets Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Food, Utilities"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Limit ($)</Form.Label>
              <Form.Control
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="e.g., 500"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Month (YYYY-MM)</Form.Label>
              <Form.Control
                type="text"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="e.g., 2025-07"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Linked Goal</Form.Label>
              <Form.Control
                as="select"
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
              >
                <option value="">Select a Goal</option>
                {goals.map((goal) => (
                  <option key={goal._id} value={goal._id}>
                    {goal.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Savings ($)</Form.Label>
              <Form.Control
                type="number"
                value={targetSavings}
                onChange={(e) => setTargetSavings(e.target.value)}
                placeholder="e.g., 1000"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Allocated Savings ($)</Form.Label>
              <Form.Control
                type="number"
                value={allocatedSavings}
                onChange={(e) => setAllocatedSavings(e.target.value)}
                placeholder="e.g., 50"
              />
            </Form.Group>
            <Button variant="primary" type="submit">Set Budget</Button>
          </Form>
        </Card.Body>
      </Card>
      <h3>Your Budgets</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Limit</th>
            <th>Month</th>
            <th>Goal</th>
            <th>Target Savings</th>
            <th>Deadline</th>
            <th>Allocated Savings</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget._id}>
              <td>{budget.category}</td>
              <td>${budget.limit}</td>
              <td>{budget.month}</td>
              <td>{goals.find(g => g._id === budget.goalId)?.name || "N/A"}</td>
              <td>${budget.targetSavings || "N/A"}</td>
              <td>{budget.deadline || "N/A"}</td>
              <td>${budget.allocatedSavings || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Budgets;