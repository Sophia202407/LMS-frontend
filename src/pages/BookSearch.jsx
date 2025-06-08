import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../style/BookSearch.css';

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use AuthContext instead of localStorage directly
  const { user, loading } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/books');
        const all = res.data;
        setAllBooks(all);

        const filtered = all.filter(b =>
          b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.isbn.includes(searchTerm) ||
          b.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setBooks(filtered);
      } catch (err) {
        setError('Failed to fetch books.');
      }
    };

    fetchBooks();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleBorrow = async (book) => {
      console.log("User from AuthContext:", user);
      console.log("User ID:", user?.id);
      console.log("User role:", user?.role);
      
    // Use user from AuthContext instead of localStorage
    if (!user || !user.id) {
      alert("User not logged in. Please login first.");
      return;
    }

    try {
      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 14);

      await axios.post("http://localhost:8080/api/loans", {
        book: { id: book.id },
        user: { id: user.id },
        loanDate: today.toISOString().split("T")[0],
        dueDate: dueDate.toISOString().split("T")[0]
      }, { withCredentials: true });

      alert("Book borrowed successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to borrow book.");
    }
  };

  const renderBookCard = (book) => {
    const isAvailable = book.status?.toLowerCase().includes('available');

    return (
      <div className="book-card" key={book.id}>
        <img
          src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
          alt={book.title}
          className="book-image"
          onError={(e) => e.target.src = '/no-cover.png'}
        />
        <h3>{book.title}</h3>
        <p>Status: <strong>{book.status}</strong></p>
        <button
          disabled={!isAvailable}
          onClick={() => handleBorrow(book)}
          className="borrow-button"
        >
          {isAvailable ? 'Borrow' : 'Unavailable'}
        </button>
      </div>
    );
  };

  const otherSuggestions = allBooks
    .filter(b => !books.some(found => found.id === b.id))
    .slice(0, 6);

  // Show loading state while AuthContext is checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="search-result-page">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search books by title, author, category, or ISBN"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <h2>Search Results for: "<span className="highlight">{initialQuery}</span>"</h2>
      {error && <p className="error">{error}</p>}

      {books.length > 0 ? (
        <div className="book-grid">
          {books.map(book => renderBookCard(book))}
        </div>
      ) : (
        <p className="no-results">No exact match found.</p>
      )}

      {otherSuggestions.length > 0 && (
        <>
          <h3 className="suggested-title">Other Books You May Like</h3>
          <div className="book-row">
            {otherSuggestions.map(book => renderBookCard(book))}
          </div>
        </>
      )}
    </div>
  );
};

export default BookSearch;


//Jun.8: update
// - Use AuthContext to get user info instead of localStorage
// - Use URLSearchParams to get initial search query from URL
// - Added loading state while fetching books
