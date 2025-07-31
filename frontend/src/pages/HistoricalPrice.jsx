import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate for back button
import axios from "axios";
import { Container, Alert, Button } from "react-bootstrap"; // Added Button
import { Chart, registerables } from "chart.js"; // Correct import
Chart.register(...registerables); // Register components

const HistoricalPrice = () => {
  const { symbol } = useParams(); // Get symbol from URL
  const navigate = useNavigate(); // Hook for navigation
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    fetchHistoricalData();
  }, [symbol]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/stocks/history/${symbol}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const sortedHistory = response.data.sort(
        (a, b) => new Date(a.historical_date) - new Date(b.historical_date)
      );
      console.log("Fetched history:", sortedHistory); // Debug log
      setHistory(sortedHistory);
      setError(null);
      createChart(sortedHistory);
    } catch (error) {
      console.error("Fetch error:", error.message, error.response?.data);
      setError("Failed to load historical data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const createChart = (data) => {
    const ctx = document.getElementById("priceChart")?.getContext("2d"); // Fixed typo
    if (!ctx) {
      console.error("Canvas context not found");
      return;
    }
    if (chartInstance) {
      chartInstance.destroy(); // Destroy previous chart instance
    }
    const newChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((item) => {
          const date = new Date(item.historical_date);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }); // Format as "Jul 31, 2025"
        }),
        datasets: [
          {
            label: `${symbol} Close Price`,
            data: data.map((item) => item.close_price),
            borderColor: "rgba(255, 99, 132, 1)", // Red
            backgroundColor: "rgba(255, 99, 132, 0.2)", // Lighter red fill
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: "Date" },
          },
          y: {
            title: { display: true, text: "Price" },
          },
        },
      },
    });
    setChartInstance(newChartInstance);
    console.log("Chart created:", newChartInstance); // Debug log
  };

  const handleGoBack = () => {
    navigate("/dashboard/predictions"); // Navigate back to Predictions page
  };

  return (
    <Container style={{ padding: "2rem" }}>
      <h2>Historical Prices for {symbol}</h2>
      <Button variant="secondary" onClick={handleGoBack} className="mb-3">
        Go Back
      </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <p>Loading historical data...</p>
      ) : (
        <div>
          <canvas id="priceChart" style={{ maxHeight: "400px" }}></canvas>
        </div>
      )}
    </Container>
  );
};

export default HistoricalPrice;