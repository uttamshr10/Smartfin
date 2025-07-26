// src/pages/Accounts.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Accounts.css";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");

  const token = localStorage.getItem("token");

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/accounts",
        { accountName, type: accountType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAccountName("");
      setAccountType("");
      fetchAccounts();
    } catch (error) {
      console.error("Account creation failed:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create New Account</h2>
      <form onSubmit={handleCreateAccount} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Account Name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          required
        />
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          required
        >
          <option value="">Select Type</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
          <option value="digital">Digital</option>
        </select>

        <button type="submit">Create</button>
      </form>

      <h3>My Accounts</h3>
      <ul>
  {accounts.map((acc) => (
    <li key={acc._id}>
      <strong>{acc.accountName}</strong> - {acc.type}
    </li>
  ))}
</ul>

    </div>
  );
};

export default Accounts;
