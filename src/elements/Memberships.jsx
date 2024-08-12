import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation
import axios from 'axios';
import '../styles/style.css';  // Import the CSS file

const Memberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [formData, setFormData] = useState({
    membership_id: '',
    membership_type: '',
    membership_discount: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = () => {
    axios.get('http://flip1.engr.oregonstate.edu:30858/api/memberships')
      .then(response => {
        setMemberships(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the memberships data!", error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://flip1.engr.oregonstate.edu:30858/api/memberships/${id}`)
      .then(() => {
        setMemberships(memberships.filter(membership => membership.membership_id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the membership!", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://flip1.engr.oregonstate.edu:30858/api/memberships/${formData.membership_id}`, formData)
        .then(() => {
          fetchMemberships(); // Refresh the memberships list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error updating the membership!", error);
        });
    } else {
      axios.post('http://flip1.engr.oregonstate.edu:30858/api/memberships', formData)
        .then(() => {
          fetchMemberships(); // Refresh the memberships list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error creating the membership!", error);
        });
    }
  };

  const handleEdit = (membership) => {
    setFormData(membership);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      membership_id: '',
      membership_type: '',
      membership_discount: ''
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

      <h1>Memberships List</h1>
      <form onSubmit={handleFormSubmit} className="form">
        <input
          type="text"
          name="membership_type"
          placeholder="Membership Type"
          value={formData.membership_type}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="membership_discount"
          placeholder="Discount"
          value={formData.membership_discount}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="button actionButton">
          {isEditing ? 'Update Membership' : 'Create Membership'}
        </button>
        {isEditing && <button type="button" onClick={resetForm} className="button resetButton">Cancel</button>}
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((membership) => (
            <tr key={membership.membership_id}>
              <td>{membership.membership_id}</td>
              <td>{membership.membership_type}</td>
              <td>{membership.membership_discount}</td>
              <td>
                <button onClick={() => handleEdit(membership)} className="button actionButton">Edit</button>
                <button onClick={() => handleDelete(membership.membership_id)} className="button deleteButton">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Memberships;




