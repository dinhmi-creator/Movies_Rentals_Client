import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/style.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // State for search term
  const [formData, setFormData] = useState({
    movie_id: '',
    title: '',
    genre: '',
    release_date: '',
    price: '',
    amount: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, [searchTerm]);  // Refetch movies when searchTerm changes

  const fetchMovies = () => {
    let query = `http://flip1.engr.oregonstate.edu:30858/api/movies`;

    if (searchTerm) {
      query += `?title=${encodeURIComponent(searchTerm)}`;
    }

    axios.get(query)
      .then(response => {
        setMovies(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the movies data!", error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://flip1.engr.oregonstate.edu:30858/api/movies/${id}`)
      .then(() => {
        setMovies(movies.filter(movie => movie.movie_id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the movie!", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://flip1.engr.oregonstate.edu:30858/api/movies/${formData.movie_id}`, formData)
        .then(() => {
          fetchMovies(); // Refresh the movies list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error updating the movie!", error);
        });
    } else {
      axios.post('http://flip1.engr.oregonstate.edu:30858/api/movies', formData)
        .then(() => {
          fetchMovies(); // Refresh the movies list
          resetForm();
        })
        .catch(error => {
          console.error("There was an error creating the movie!", error);
        });
    }
  };

  const handleEdit = (movie) => {
    setFormData(movie);
    setIsEditing(true);
  };

  const resetForm = () => {
    setFormData({
      movie_id: '',
      title: '',
      genre: '',
      release_date: '',
      price: '',
      amount: ''
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
      {/* Navigation Links */}
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/customers" className="nav-link">Customers</Link>
        <Link to="/memberships" className="nav-link">Memberships</Link>
        <Link to="/movies" className="nav-link">Movies</Link>
        <Link to="/payments" className="nav-link">Payments</Link>
        <Link to="/rentals" className="nav-link">Rentals</Link>
      </nav>

      <h1>Movies List</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Title"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />

      <form onSubmit={handleFormSubmit} className="form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="release_date"
          placeholder="Release Date"
          value={formData.release_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="button actionButton">
          {isEditing ? 'Update Movie' : 'Create Movie'}
        </button>
        {isEditing && <button type="button" onClick={resetForm} className="button resetButton">Cancel</button>}
      </form>
      
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Release Date</th>
            <th>Price</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.movie_id}>
              <td>{movie.movie_id}</td>
              <td>{movie.title}</td>
              <td>{movie.genre}</td>
              <td>{formatDate(movie.release_date)}</td>
              <td>{movie.price}</td>
              <td>{movie.amount}</td>
              <td>
                <button onClick={() => handleEdit(movie)} className="button actionButton">Edit</button>
                <button onClick={() => handleDelete(movie.movie_id)} className="button deleteButton">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movies;

