import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import axios from 'axios';
import '../styles/style.css';  // Import the CSS file

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [formData, setFormData] = useState({
    rental_id: '',
    movie_id: '',
    customer_id: '',
    start_date: '',
    due_date: '',
    date_returned: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = () => {
    axios.get('http://flip1.engr.oregonstate.edu:4003/api/rentals')
      .then(response => {
        setRentals(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the rentals data!", error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://flip1.engr.oregonstate.edu:4003/api/rentals/${id}`)
      .then(() => {
        setRentals(rentals.filter(rental => rental.rental_id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the rental!", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://flip1.engr.oregonstate.edu:4003/api/rentals/${formData.rental_id}`, formData)
        .then(() => {
          fetchRentals(); // Refresh the rentals list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error updating the rental!", error);
        });
    } else {
      axios.post('http://flip1.engr.oregonstate.edu:4003/api/rentals', formData)
        .then(() => {
          fetchRentals(); // Refresh the rentals list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error creating the rental!", error);
        });
    }
  };

  const handleEdit = (rental) => {
    setFormData({
      rental_id: rental.rental_id,
      movie_id: rental.movie_id,
      customer_id: rental.customer_id,
      start_date: rental.start_date ? rental.start_date.substring(0, 10) : '',
      due_date: rental.due_date ? rental.due_date.substring(0, 10) : '',
      date_returned: rental.date_returned ? rental.date_returned.substring(0, 10) : ''
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      rental_id: '',
      movie_id: '',
      customer_id: '',
      start_date: '',
      due_date: '',
      date_returned: ''
    });
    setIsEditing(false);
  };

  return (
    <div className="container">
      {/* Navigation Links */}
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/customers" className="nav-link">Customers</Link>
        <Link to="/memberships" className="nav-link">Memberships</Link>
        <Link to="/movies" className="nav-link">Movies</Link>
        <Link to="/payments" className="nav-link">Payments</Link>
        <Link to="/rentals" className="nav-link">Rentals</Link>
      </nav>

      <h1>Rentals List</h1>
      <form onSubmit={handleFormSubmit} className="form">
        <input
          type="number"
          name="movie_id"
          placeholder="Movie ID"
          value={formData.movie_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="customer_id"
          placeholder="Customer ID"
          value={formData.customer_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="start_date"
          placeholder="Start Date"
          value={formData.start_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="due_date"
          placeholder="Due Date"
          value={formData.due_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date_returned"
          placeholder="Date Returned"
          value={formData.date_returned}
          onChange={handleInputChange}
        />
        <button type="submit" className="button actionButton">
          {isEditing ? 'Update Rental' : 'Create Rental'}
        </button>
        {isEditing && <button type="button" onClick={resetForm} className="button resetButton">Cancel</button>}
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Movie ID</th>
            <th>Customer ID</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th>Date Returned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.rental_id}>
              <td>{rental.rental_id}</td>
              <td>{rental.movie_id}</td>
              <td>{rental.customer_id}</td>
              <td>{rental.start_date ? rental.start_date.substring(0, 10) : ''}</td>
              <td>{rental.due_date ? rental.due_date.substring(0, 10) : ''}</td>
              <td>{rental.date_returned ? rental.date_returned.substring(0, 10) : 'Not Returned'}</td>
              <td>
                <button onClick={() => handleEdit(rental)} className="button actionButton">Edit</button>
                <button onClick={() => handleDelete(rental.rental_id)} className="button deleteButton">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Rentals;

