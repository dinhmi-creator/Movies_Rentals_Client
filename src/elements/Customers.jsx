import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/style.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // State for search term
  const [formData, setFormData] = useState({
    customer_id: '',
    customer_name: '',
    phone_number: '',
    membership_id: null  // Default to null if no membership is selected
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);  // Refetch customers when searchTerm changes

  const fetchCustomers = () => {
    let query = `http://flip1.engr.oregonstate.edu:30858/api/customers`;

    // Add the search parameter for customer_name if searchTerm is not empty
    if (searchTerm) {
      query += `?customer_name=${encodeURIComponent(searchTerm)}`;
    }

    axios.get(query)
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
      membership_id: null
    });
    setIsEditing(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />

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
        <select
          name="membership_id"
          value={formData.membership_id}
          onChange={handleInputChange}
          className="dropdown"
        >
          <option value={null}>No Membership</option>
          <option value={1}>Membership 1</option>
          <option value={2}>Membership 2</option>
          <option value={3}>Membership 3</option>
        </select>
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
            <th>Phone Number</th>
            <th>Membership ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.phone_number}</td>
              <td>{customer.membership_id || 'No Membership'}</td>
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
