import React, { useState, useEffect } from "react";
import { Form, Button, Table, Alert } from "react-bootstrap";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const Transactions = () => {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // State for success messages
  const [editTransaction, setEditTransaction] = useState(null); // State for editing

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetch transactions - Token:", token);
      const response = await axios.get("http://localhost:3000/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
    } catch (err) {
      setError("Failed to load transactions");
      console.log("Fetch transactions error:", err.response?.data); // Debug error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Submit transaction - Token:", token);
      const payload = {
        type,
        category,
        amount: parseFloat(amount),
        date,
        note,
        userId: JSON.parse(atob(token.split('.')[1])).userId, // Ensure userId is included
      };
      console.log("Sending transaction data, userId:", payload.userId, "Full payload:", payload);

      let response;
      if (editTransaction) {
        response = await axios.put(
          `http://localhost:3000/api/transactions/${editTransaction._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(transactions.map((t) => (t._id === editTransaction._id ? response.data : t)));
        setSuccess("Transaction updated successfully!"); // Success message for update
      } else {
        response = await axios.post(
          "http://localhost:3000/api/transactions",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions([...transactions, response.data]);
        setSuccess("Transaction added successfully!"); // Success message for create
      }
      setType("expense");
      setCategory("");
      setAmount("");
      setDate("");
      setNote("");
      setError(null);
      setEditTransaction(null); // Reset edit state
    } catch (err) {
      setError(err.response?.data?.error || "Failed to " + (editTransaction ? "update" : "add") + " transaction");
      console.log("Submit transaction error:", err.response?.data); // Debug error
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((t) => t._id !== id));
      setSuccess("Transaction deleted successfully!"); // Success message for delete
      setError(null);
    } catch (err) {
      setError("Failed to delete transaction");
      console.log("Delete transaction error:", err.response?.data); // Debug error
    }
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    setType(transaction.type);
    setCategory(transaction.category);
    setAmount(transaction.amount.toString());
    setDate(transaction.date.split("T")[0]); // Format date for input
    setNote(transaction.note || "");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Transactions</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>} {/* Display success message */}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Note</Form.Label>
          <Form.Control as="textarea" value={note} onChange={(e) => setNote(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          {editTransaction ? "Update Transaction" : "Add Transaction"}
        </Button>
        {editTransaction && (
          <Button
            variant="secondary"
            onClick={() => {
              setType("expense");
              setCategory("");
              setAmount("");
              setDate("");
              setNote("");
              setEditTransaction(null);
            }}
            className="ms-2"
          >
            Cancel
          </Button>
        )}
      </Form>
      <h3>Your Transactions</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td>Rs. {t.amount}</td>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.note || "N/A"}</td>
              <td>
                <FaEdit
                  style={{ cursor: "pointer", marginRight: "10px", color: "#007bff" }}
                  onClick={() => handleEdit(t)}
                />
                <FaTrash
                  style={{ cursor: "pointer", color: "#dc3545" }}
                  onClick={() => handleDelete(t._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Transactions;