import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/style.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [formData, setFormData] = useState({
    payment_id: '',
    payment_amount: '',
    payment_date: '',
    payment_method: '',
    payment_status: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [searchTerm]); // Refetch payments when searchTerm changes

  const fetchPayments = () => {
    let query = `http://flip1.engr.oregonstate.edu:30858/api/payments`;

    if (searchTerm) {
      query += `?payment_method=${encodeURIComponent(searchTerm)}`;
    }

    axios.get(query)
      .then(response => {
        setPayments(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the payments data!", error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://flip1.engr.oregonstate.edu:30858/api/payments/${id}`)
      .then(() => {
        setPayments(payments.filter(payment => payment.payment_id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the payment!", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://flip1.engr.oregonstate.edu:30858/api/payments/${formData.payment_id}`, formData)
        .then(() => {
          fetchPayments(); // Refresh the payments list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error updating the payment!", error);
        });
    } else {
      axios.post('http://flip1.engr.oregonstate.edu:30858/api/payments', formData)
        .then(() => {
          fetchPayments(); // Refresh the payments list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error creating the payment!", error);
        });
    }
  };

  const handleEdit = (payment) => {
    setFormData(payment);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      payment_id: '',
      payment_amount: '',
      payment_date: '',
      payment_method: '',
      payment_status: ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/customers" className="nav-link">Customers</Link>
        <Link to="/memberships" className="nav-link">Memberships</Link>
        <Link to="/movies" className="nav-link">Movies</Link>
        <Link to="/payments" className="nav-link">Payments</Link>
        <Link to="/rentals" className="nav-link">Rentals</Link>
      </nav>
      <h1>Payments List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Payment Method"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <form onSubmit={handleFormSubmit} className="form">
        <input
          type="number"
          step="0.01"
          name="payment_amount"
          placeholder="Amount"
          value={formData.payment_amount}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="payment_date"
          placeholder="Date"
          value={formData.payment_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="payment_method"
          placeholder="Method"
          value={formData.payment_method}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="payment_status"
          placeholder="Status"
          value={formData.payment_status}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="button actionButton">
          {isEditing ? 'Update Payment' : 'Create Payment'}
        </button>
        {isEditing && <button type="button" onClick={resetForm} className="button resetButton">Cancel</button>}
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payment_id}>
              <td>{payment.payment_id}</td>
              <td>{payment.payment_amount}</td>
              <td>{formatDate(payment.payment_date)}</td> {/* Formatted Date */}
              <td>{payment.payment_method}</td>
              <td>{payment.payment_status}</td>
              <td>
                <button onClick={() => handleEdit(payment)} className="button actionButton">Edit</button>
                <button onClick={() => handleDelete(payment.payment_id)} className="button deleteButton">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;

