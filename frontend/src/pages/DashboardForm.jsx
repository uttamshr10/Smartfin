// DashboardForm.jsx
import React from 'react';
import './DashboardForm.css';

const DashboardForm = () => {
  return (
    <div className="dashboard-form-container">
      <div className="space-bg">
        <h2 className="form-heading">🚀 Personal Finance Survey</h2>
        <form className="survey-form">
          <label>Name:
            <input type="text" name="name" required />
          </label>

          <label>Age:
            <input type="number" name="age" required />
          </label>

          <label>Source of Income:
            <input type="text" name="incomeSource" required />
          </label>

          <label>Monthly Income:
            <input type="number" name="monthlyIncome" required />
          </label>

          <label>Monthly Expenses:
            <input type="number" name="expenses" required />
          </label>

          <label>Saving Goal This Month:
            <input type="number" name="goal" required />
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default DashboardForm;
