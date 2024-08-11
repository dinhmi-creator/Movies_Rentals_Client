import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/style.css';  // Import the CSS file

const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to the Movie Rental System</h1>
      <p>Manage your movie rentals efficiently with our system.</p>

      <div id="navigation" className="section">
        <h2>Navigation</h2>
        <ul className="list">
          <li><Link to="/memberships" className="link">Manage Memberships</Link></li>
          <li><Link to="/customers" className="link">Manage Customers</Link></li>
          <li><Link to="/payments" className="link">Manage Payments</Link></li>
          <li><Link to="/movies" className="link">Manage Movies</Link></li>
          <li><Link to="/rentals" className="link">Manage Rentals</Link></li>
        </ul>
      </div>

      <div id="about" className="section">
        <h2>About</h2>
        <p>This system allows you to manage memberships, customers, payments, movies, and rentals efficiently. Use the navigation links above to get started with managing the different entities.</p>
      </div>

      <div id="contact" className="section">
        <h2>Contact Us</h2>
        <p>If you have any questions or need support, please contact us at <a href="mailto:support@movierental.com" className="link">support@movierental.com</a>.</p>
      </div>
    </div>
  );
};

export default HomePage;

