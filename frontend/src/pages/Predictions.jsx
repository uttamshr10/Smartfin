import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Alert, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // For navigation

const Predictions = () => {
  const [favoriteStocks, setFavoriteStocks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedStatuses, setCheckedStatuses] = useState({}); // Track checked statuses
  const [trends, setTrends] = useState({}); // Track trends for each stock
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchFavoriteStocks();
  }, []);

  const fetchFavoriteStocks = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3000/api/favorite-stocks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const stocks = response.data;

      // Fetch trend for each stock
      const trendsData = {};
      await Promise.all(
        stocks.map(async (stock) => {
          try {
            const historyResponse = await axios.get(
              `http://localhost:3000/api/stocks/history/${stock.symbol}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const history = historyResponse.data;
            if (history && history.length >= 2) {
              const sortedHistory = history.sort(
                (a, b) => new Date(b.historical_date) - new Date(a.historical_date)
              );
              const currentClosePrice = sortedHistory[0].close_price;
              const lastClosePrice = sortedHistory[1].close_price;
              trendsData[stock.symbol] = currentClosePrice > lastClosePrice ? "⬆📈" : "📉";
            } else {
              trendsData[stock.symbol] = "N/A";
            }
          } catch (err) {
            console.error(`Error fetching history for ${stock.symbol}:`, err.message);
            trendsData[stock.symbol] = "N/A";
          }
        })
      );

      setFavoriteStocks(stocks);
      setTrends(trendsData);
      setError(null);
    } catch (error) {
      setError("Failed to load favorite stocks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (symbol) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/stocks/classify/${symbol}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data && response.data.status) {
        setCheckedStatuses((prev) => ({
          ...prev,
          [symbol]: response.data.status,
        }));
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(`Error fetching status for ${symbol}:`, error.message, error.response?.data);
      setCheckedStatuses((prev) => ({
        ...prev,
        [symbol]: "Error",
      }));
      setError(`Failed to fetch status for ${symbol}: ${error.message}`);
    }
  };

  const handleViewHistoricalPrices = (symbol) => {
    navigate(`/dashboard/historical-price/${symbol}`, { replace: true }); // Correct full path
  };

  return (
    <Container style={{ padding: "2rem" }}>
      <h2>Your Favorite Stocks</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <p>Loading favorite stocks...</p>
      ) : favoriteStocks.length > 0 ? (
        <Table striped bordered hover>
          <thead className="table-dark">
            <tr>
              <th>Symbol</th>
              <th>Trend</th>
              <th>Future Recommendation</th>
              <th>Historical Prices</th>
            </tr>
          </thead>
          <tbody>
            {favoriteStocks.map((stock) => (
              <tr key={stock._id}>
                <td>{stock.symbol}</td>
                <td>{trends[stock.symbol] || "N/A"}</td>
                <td>
                  {checkedStatuses[stock.symbol] ? (
                    checkedStatuses[stock.symbol]
                  ) : (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCheckStatus(stock.symbol);
                      }}
                    >
                      Check
                    </a>
                  )}
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewHistoricalPrices(stock.symbol)}
                  >
                    Price History
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No favorite stocks available.</p>
      )}
    </Container>
  );
};

export default Predictions;