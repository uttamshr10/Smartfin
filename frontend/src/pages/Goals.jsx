import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Table, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Goals = () => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(response.data);
      } catch (err) {
        setError("Failed to load goals");
      }
    };
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name,
        targetAmount: parseFloat(targetAmount),
        deadline,
        description,
      };
      console.log("Sending goal data, payload:", payload);

      const response = await axios.post(
        "http://localhost:3000/api/goals",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals([...goals, response.data]);
      setSuccess("Goal created successfully!");
      setName("");
      setTargetAmount("");
      setDeadline("");
      setDescription("");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create goal");
      setSuccess(null);
    }
  };

  const updateProgress = async (goalId, amount) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/goals/progress",
        { goalId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedGoals = goals.map((goal) =>
        goal._id === goalId ? { ...goal, currentAmount: goal.currentAmount + amount } : goal
      );
      setGoals(updatedGoals);
      setSuccess("Progress updated!");
    } catch (err) {
      setError("Failed to update progress");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Goals Page</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Goal Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Vacation Fund"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Amount ($)</Form.Label>
              <Form.Control
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g., 1000"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Save for a trip"
              />
            </Form.Group>
            <Button variant="primary" type="submit">Set Goal</Button>
          </Form>
        </Card.Body>
      </Card>
      <h3>Your Goals</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Target Amount</th>
            <th>Current Amount</th>
            <th>Deadline</th>
            <th>Progress</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100 || 0;
            return (
              <tr key={goal._id}>
                <td>{goal.name}</td>
                <td>${goal.targetAmount}</td>
                <td>${goal.currentAmount}</td>
                <td>{new Date(goal.deadline).toLocaleDateString()}</td>
                <td>
                  <ProgressBar now={progress} label={`${progress.toFixed(1)}%`} />
                </td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => updateProgress(goal._id, 50)}
                    size="sm"
                  >
                    Add $50
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Goals;