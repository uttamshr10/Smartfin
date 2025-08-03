import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons


const Budgets = () => {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [month, setMonth] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editBudget, setEditBudget] = useState(null); // State for editing
  const navigate = useNavigate();

  useEffect(() => {
    fetchBudgets();
  }, []);

  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = { category, limit: parseFloat(limit), month };
      let response;
      if (editBudget) {
        response = await axios.put(
          `http://localhost:3000/api/budgets/${editBudget._id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBudgets(budgets.map((budget) => (budget._id === editBudget._id ? response.data : budget)));
      } else {
        response = await axios.post(
          "http://localhost:3000/api/budgets",
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBudgets([...budgets, response.data]);
      }
      setSuccess("Budget " + (editBudget ? "updated" : "created") + " successfully!");
      setCategory("");
      setLimit("");
      setMonth("");
      setError(null);
      setEditBudget(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to " + (editBudget ? "update" : "create") + " budget");
      setSuccess(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(budgets.filter((budget) => budget._id !== id));
      setSuccess("Budget deleted successfully!");
      setError(null);
    } catch (err) {
      setError("Failed to delete budget");
      setSuccess(null);
    }
  };

  const handleEdit = (budget) => {
    setEditBudget(budget);
    setCategory(budget.category);
    setLimit(budget.limit.toString());
    setMonth(budget.month);
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
              <Form.Label>Limit (Rs.)</Form.Label>
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
            <Button variant="primary" type="submit">
              {editBudget ? "Update Budget" : "Set Budget"}
            </Button>
            {editBudget && (
              <Button
                variant="secondary"
                onClick={() => {
                  setCategory("");
                  setLimit("");
                  setMonth("");
                  setEditBudget(null);
                }}
                className="ms-2"
              >
                Cancel
              </Button>
            )}
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget._id}>
              <td>{budget.category}</td>
              <td>Rs. {budget.limit}</td>
              <td>{budget.month}</td>
              <td>
                <FaEdit
                  style={{ cursor: "pointer", marginRight: "10px", color: "#007bff" }}
                  onClick={() => handleEdit(budget)}
                />
                <FaTrash
                  style={{ cursor: "pointer", color: "#dc3545" }}
                  onClick={() => handleDelete(budget._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Budgets;