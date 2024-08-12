import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import axios from 'axios';
import '../styles/style.css';  // Import the CSS file

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    phone_number: '',
    membership_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get('http://flip1.engr.oregonstate.edu:30858/api/customers')
      .then(response => {
        setCustomers(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the customers data!", error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://flip1.engr.oregonstate.edu:30858/api/customers/${id}`)
      .then(() => {
        setCustomers(customers.filter(customer => customer.customer_id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the customer!", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://flip1.engr.oregonstate.edu:30858/api/customers/${formData.customer_id}`, formData)
        .then(() => {
          fetchCustomers(); // Refresh the customers list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error updating the customer!", error);
        });
    } else {
      axios.post('http://flip1.engr.oregonstate.edu:30858/api/customers', formData)
        .then(() => {
          fetchCustomers(); // Refresh the customers list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error creating the customer!", error);
        });
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      customer_name: '',
      phone_number: '',
      membership_id: ''
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

      <h1>Customers List</h1>
      <form onSubmit={handleFormSubmit} className="form">
        <input
          type="text"
          name="customer_name"
          placeholder="Customer Name"
          value={formData.customer_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="membership_id"
          placeholder="Membership ID"
          value={formData.membership_id}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="button actionButton">
          {isEditing ? 'Update Customer' : 'Create Customer'}
        </button>
        {isEditing && <button type="button" onClick={resetForm} className="button resetButton">Cancel</button>}
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Membership</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.phone_number}</td>
              <td>{customer.membership_id}</td>
              <td>
                <button onClick={() => handleEdit(customer)} className="button actionButton">Edit</button>
                <button onClick={() => handleDelete(customer.customer_id)} className="button deleteButton">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
