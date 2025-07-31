import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Alert, Container, Row, Col, Spinner } from "react-bootstrap";

const StockDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoriteStocks, setFavoriteStocks] = useState(new Set());

  useEffect(() => {
    fetchAllStocks();
    fetchFavoriteStocks();
  }, []);

  const fetchAllStocks = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/stocks", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setStocks(response.data);
        setError(null);
      })
      .catch((error) => {
        setError("Failed to load stocks: " + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchFavoriteStocks = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/favorite-stocks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const favorites = new Set(response.data.map((fav) => fav.symbol));
        setFavoriteStocks(favorites);
      })
      .catch((error) => {
        console.error("Failed to load favorite stocks:", error);
      });
  };

  const toggleFavorite = (symbol) => {
    const token = localStorage.getItem("token");
    const isFavorite = favoriteStocks.has(symbol);
    const url = `http://localhost:3000/api/favorite-stocks/stocks/${symbol}`;
    const method = isFavorite ? "delete" : "post";

    axios({
      method,
      url,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setFavoriteStocks((prev) => {
          const newFavorites = new Set(prev);
          isFavorite ? newFavorites.delete(symbol) : newFavorites.add(symbol);
          return newFavorites;
        });
      })
      .catch((error) => {
        setError(`Failed to ${isFavorite ? "unfavorite" : "favorite"} stock: ${error.message}`);
      });
  };

  const handleSearch = () => {
    if (search.trim() === "") {
      fetchAllStocks();
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:3000/api/stocks/${search}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          if (response.data.error) {
            setError(response.data.error);
            setStocks([]);
          } else {
            setStocks([response.data]);
            setError(null);
          }
        })
        .catch((error) => {
          setError("Stock not found or error: " + error.message);
          setStocks([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4 text-primary">📈 NEPSE Stock Dashboard</h2>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            value={search}
            placeholder="🔎 Enter stock symbol (e.g., NABIL)"
            onChange={(e) => setSearch(e.target.value.toUpperCase())}
          />
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Search"}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive">
        <Table striped bordered hover size="sm">
          <thead className="table-dark">
            <tr>
              <th>Symbol</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>LTP</th>
              <th>Volume</th>
              <th>Turnover</th>
              <th>Favorite</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td><strong>{stock.symbol}</strong></td>
                  <td>{stock.open_price}</td>
                  <td>{stock.high_price}</td>
                  <td>{stock.low_price}</td>
                  <td>{stock.close_price}</td>
                  <td className="text-success">{stock.ltp}</td>
                  <td>{stock.volume}</td>
                  <td>{stock.turnover}</td>
                  <td>
                    <span
                      role="button"
                      style={{ cursor: "pointer", fontSize: "1.5em" }}
                      onClick={() => toggleFavorite(stock.symbol)}
                    >
                      {favoriteStocks.has(stock.symbol) ? "❤️" : "🤍"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  {loading ? "Loading stocks..." : "No stocks found"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default StockDashboard;