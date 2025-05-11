// C:\Users\Uttam\Desktop\smartfin\frontend\src\components\StockDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const StockDashboard = () => {
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("/api/stocks") // Proxied to http://localhost:3000/stocks
            .then((response) => {
                console.log("All stocks response:", response.data);
                setStocks(response.data);
                setError(null);
            })
            .catch((error) => {
                console.error("Axios error fetching stocks:", error.message, error.response?.data);
                setError("Failed to fetch stocks: " + error.message);
            });
    }, []);

    const handleSearch = () => {
        if (search.trim() === "") {
            axios
                .get("/api/stocks")
                .then((response) => {
                    console.log("All stocks response (empty search):", response.data);
                    setStocks(response.data);
                    setError(null);
                })
                .catch((error) => {
                    console.error("Axios error fetching stocks (empty search):", error.message, error.response?.data);
                    setError("Failed to fetch stocks: " + error.message);
                });
        } else {
            axios
                .get(`/api/stocks/${search}`)
                .then((response) => {
                    console.log(`Stock response for ${search}:`, response.data);
                    if (response.data.error) {
                        setError(response.data.error);
                        setStocks([]);
                    } else {
                        setStocks([response.data]);
                        setError(null);
                    }
                })
                .catch((error) => {
                    console.error(`Axios error fetching stock ${search}:`, error.message, error.response?.data);
                    setError("Stock not found or server error: " + error.message);
                    setStocks([]);
                });
        }
    };

    return (
        <div>
            <h2>NEPSE Stock Dashboard</h2>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol"
            />
            <button onClick={handleSearch}>Search</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table>
                <thead>
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
                                <td>{stock.symbol}</td>
                                <td>{stock.open_price}</td>
                                <td>{stock.high_price}</td>
                                <td>{stock.low_price}</td>
                                <td>{stock.close_price}</td>
                                <td>{stock.ltp}</td>
                                <td>{stock.volume}</td>
                                <td>{stock.turnover}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No stocks found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StockDashboard;