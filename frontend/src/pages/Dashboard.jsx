import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "./Dashboard.css";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Dashboard = () => {
  const [firstName, setFirstName] = useState("User");
  const [transactions, setTransactions] = useState([]);
  const [incomeChart, setIncomeChart] = useState(null);
  const [expensesChart, setExpensesChart] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [goals, setGoals] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user name once on mount
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("http://localhost:3000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFirstName(response.data.firstName || "User");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUserName();
  }, []);

  // Fetch transactions only when on /dashboard route
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      const fetchTransactions = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:3000/api/transactions", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const sorted = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
          setTransactions(sorted);
        } catch (err) {
          console.error("Error fetching transactions:", err);
        }
      };
      fetchTransactions();
    }
  }, [location.pathname]);

  // Fetch goals only when on /dashboard route
  useEffect(() => {
    if (location.pathname === "/dashboard") {
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
    }
  }, [location.pathname]);

  // Update charts when transactions change and on /dashboard route
  useEffect(() => {
    if (location.pathname === "/dashboard" && transactions.length > 0) {
      const income = transactions.filter((t) => t.type === "income");
      const expenses = transactions.filter((t) => t.type === "expense");

      renderChart(
        "incomeChart",
        incomeChart,
        setIncomeChart,
        income,
        "Income (Rs.)",
        "rgba(75, 192, 192, 1)",
        "rgba(75, 192, 192, 0.2)"
      );

      renderChart(
        "expensesChart",
        expensesChart,
        setExpensesChart,
        expenses,
        "Expenses (Rs.)",
        "rgba(255, 99, 132, 1)",
        "rgba(255, 99, 132, 0.2)"
      );
    }
  }, [transactions, location.pathname]);

  const renderChart = (canvasId, chartInstance, setChartInstance, data, label, borderColor, bgColor) => {
    const ctx = document.getElementById(canvasId)?.getContext("2d");
    if (!ctx || data.length === 0) return;

    if (chartInstance) chartInstance.destroy();

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        ),
        datasets: [
          {
            label,
            data: data.map((item) => item.amount),
            borderColor,
            backgroundColor: bgColor,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: "Date" } },
          y: { title: { display: true, text: "Amount (Rs.)" } },
        },
      },
    });

    setChartInstance(chart);
  };

  const showGreeting = location.pathname === "/dashboard";

  const handleUpdateProfile = () => {
    setShowPopup(false);
    navigate("/update-profile");
  };

  const handleImageClick = () => {
    setShowPopup(!showPopup);
  };

  // Saving tips with improved daily saving logic (handle negatives)
  const renderSavingTips = () => {
    const today = new Date();

    const activeGoals = goals.filter((goal) => {
      const isGoalMet = (goal.currentAmount || 0) >= goal.targetAmount;
      const isDeadlineFuture = new Date(goal.deadline) > today;
      return !isGoalMet && isDeadlineFuture;
    });

    if (activeGoals.length === 0) {
      return (
        <p>You don't have any active goals currently. 🎉</p>
      );
    }

    return activeGoals.map((goal) => {
      const remainingAmount = goal.targetAmount - (goal.currentAmount || 0);
      const remainingDays = Math.ceil(
        (new Date(goal.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      let dailySaving;
      if (remainingDays > 0) {
        dailySaving = Math.ceil(remainingAmount / remainingDays);
      } else {
        dailySaving = remainingAmount;
      }

      // Handle dailySaving negative or zero
      let dailySavingText;
      if (dailySaving <= 0) {
        dailySavingText = "You are almost there! Just a little more to reach your goal.";
      } else {
        dailySavingText = `You need to save Rs. ${dailySaving} daily to meet your goal`;
      }

      return (
        <div
          key={goal._id}
          style={{
            background: "#f4f4f4",
            borderRadius: "10px",
            padding: "15px 20px",
            marginBottom: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: 0 }}>
            💡 {dailySavingText} "<strong>{goal.name}</strong>" by{" "}
            <strong>{new Date(goal.deadline).toLocaleDateString()}</strong>.
          </p>
          <button
            style={{
              marginTop: "8px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/dashboard/goals")}
          >
            Add money to your goal now
          </button>
        </div>
      );
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {showGreeting && (
          <>
            <div style={{ textAlign: "left", color: "black", padding: "10px 20px", fontSize: "24px" }}>
              Hi {firstName}
            </div>

            {/* Profile image */}
            <div style={{ position: "absolute", top: "10px", right: "20px" }}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                alt="Profile"
                style={{ cursor: "pointer", marginTop: "30px", borderRadius: "50%", width: "40px", height: "40px" }}
                onClick={handleImageClick}
              />
              {showPopup && (
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
                    background: "white",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    animation: "fadeIn 0.3s",
                    zIndex: 1000,
                  }}
                >
                  <div style={{ cursor: "pointer", padding: "5px" }} onClick={handleUpdateProfile}>
                    Update your profile
                  </div>
                </div>
              )}
            </div>

            {/* Charts */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                padding: "20px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 48%", minWidth: "300px", height: "280px" }}>
                <h4 style={{ textAlign: "center" }}>📈 Income Over Time</h4>
                <canvas id="incomeChart" style={{ width: "100%", height: "100%" }}></canvas>
              </div>
              <div style={{ flex: "1 1 48%", minWidth: "300px", height: "280px" }}>
                <h4 style={{ textAlign: "center" }}>📉 Expenses Over Time</h4>
                <canvas id="expensesChart" style={{ width: "100%", height: "100%" }}></canvas>
              </div>
            </div>

            {/* Saving Tips */}
            <div style={{ padding: "20px" }}>
              <h4>Saving Tips</h4>
              {renderSavingTips()}
            </div>
          </>
        )}

        <Outlet />

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Dashboard;
