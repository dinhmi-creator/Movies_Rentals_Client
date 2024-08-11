import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './elements/HomePage';
import Payments from './elements/Payments';
import Rentals from './elements/Rentals';
import Movies from './elements/Movies';
import Customers from './elements/Customers';
import Memberships from './elements/Memberships';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/memberships" element={<Memberships />} />
      </Routes>
    </Router>
  );
}

export default App;
