import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to add a transaction.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/transactions",
        {
          amount: parseFloat(amount),
          category,
          date,
          description: description || "",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Transaction added successfully");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      fetchTransactions(); // Refresh list
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Error adding transaction: " + (error.response?.data?.error || error.message));
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Transactions</h2>
      <p>Review your past and ongoing transactions.</p>

      <h3>Add New Transaction</h3>
      <form onSubmit={handleAddTransaction}>
        <input
          type="number"
          placeholder="Amount (NPR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Transaction</button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>Your Transactions</h3>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((txn) => (
            <li key={txn._id}>
              <strong>NPR {txn.amount}</strong> - {txn.category} on{" "}
              {new Date(txn.date).toLocaleDateString()} ({txn.description})
            </li>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </ul>
    </div>
  );
};

export default Transactions;
