// example inside Login.js or useEffect in Dashboard.js

fetch('http://localhost:3000/api/stocks')
  .then(res => res.json())
  .then(data => console.log(data));
