import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Table, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const Goals = () => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editGoal, setEditGoal] = useState(null); // State for editing
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, []);

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

      let response;
      if (editGoal) {
        response = await axios.put(
          `http://localhost:3000/api/goals/${editGoal._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGoals(goals.map((goal) => (goal._id === editGoal._id ? response.data : goal)));
        setSuccess("Goal updated successfully!");
      } else {
        response = await axios.post(
          "http://localhost:3000/api/goals",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGoals([...goals, response.data]);
        setSuccess("Goal created successfully!");
      }
      setName("");
      setTargetAmount("");
      setDeadline("");
      setDescription("");
      setError(null);
      setEditGoal(null); // Reset edit state
    } catch (err) {
      setError(err.response?.data?.error || "Failed to " + (editGoal ? "update" : "create") + " goal");
      setSuccess(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter((goal) => goal._id !== id));
      setSuccess("Goal deleted successfully!");
      setError(null);
    } catch (err) {
      setError("Failed to delete goal");
    }
  };

  const handleEdit = (goal) => {
    setEditGoal(goal);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setDeadline(goal.deadline.split("T")[0]); // Format date for input
    setDescription(goal.description || "");
  };

  const updateProgress = async (goalId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/goals/progress",
        { goalId, amount: 500 }, // Fixed to Rs. 500
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedGoals = goals.map((goal) =>
        goal._id === goalId ? { ...goal, currentAmount: goal.currentAmount + 500 } : goal
      );
      setGoals(updatedGoals);
      setSuccess("Progress updated by Rs. 500!");
    } catch (err) {
      setError("Failed to update progress");
    }
  };

  const isDeadlinePast = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const goalDeadline = new Date(deadline);
    goalDeadline.setHours(0, 0, 0, 0); // Normalize to start of day
    return goalDeadline < today;
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
              <Form.Label>Target Amount (Rs.)</Form.Label>
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
            <Button variant="primary" type="submit">
              {editGoal ? "Update Goal" : "Set Goal"}
            </Button>
            {editGoal && (
              <Button
                variant="secondary"
                onClick={() => {
                  setName("");
                  setTargetAmount("");
                  setDeadline("");
                  setDescription("");
                  setEditGoal(null);
                }}
                className="ms-2"
              >
                Cancel
              </Button>
            )}
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
            const isPastDeadline = isDeadlinePast(goal.deadline);
            const progressLabel = progress === 100 ? "Goal Achieved ✅" : `${progress.toFixed(1)}%`; // Emphasized label

            return (
              <tr key={goal._id}>
                <td>{goal.name}</td>
                <td>Rs. {goal.targetAmount}</td>
                <td>Rs. {goal.currentAmount}</td>
                <td style={{ color: isPastDeadline ? "red" : "inherit" }}>
                  {new Date(goal.deadline).toLocaleDateString()}
                </td>
                <td>
                  <ProgressBar
                    now={progress}
                    label={progressLabel}
                    variant={progress === 100 ? "success" : "primary"}
                  />
                </td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => updateProgress(goal._id)}
                    size="sm"
                  >
                    Add Rs.500
                  </Button>
                  <FaEdit
                    style={{ cursor: "pointer", marginLeft: "10px", color: "#007bff" }}
                    onClick={() => handleEdit(goal)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer", marginLeft: "10px", color: "#dc3545" }}
                    onClick={() => handleDelete(goal._id)}
                  />
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