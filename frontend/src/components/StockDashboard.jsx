import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Alert, Container, Row, Col } from "react-bootstrap";

const StockDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllStocks();
  }, []);

  const fetchAllStocks = () => {
   axios.get("http://localhost:3000/api/stocks")

      .then((response) => {
        setStocks(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Fetch error:", error.message);
        setError("Failed to load stocks: " + error.message);
      });
  };
useEffect(() => {
  axios.get("http://localhost:3000/api/stocks")
    .then((res) => setStocks(res.data))
    .catch((err) => setError("Failed to fetch stocks"));
}, []);

  const handleSearch = () => {
    if (search.trim() === "") {
      fetchAllStocks();
    } else {
     axios.get(`http://localhost:3000/api/stocks/${search}`)

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
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">No stocks found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default StockDashboard;
