import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Books.css';

const initialForm = {
  isbn: '',
  title: '',
  author: '',
  category: '',
  publicationYear: '',
  copiesAvailable: '',
  status: 'available',
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/books');
      setBooks(res.data);
    } catch (err) {
      setError('Failed to fetch books.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
    if (editingId) {
      // Update existing book (PUT /api/books/{id})
      await axios.put(`http://localhost:8080/api/books/${editingId}`, form, {
        withCredentials: true, // Required for session cookies
      });
      setBooks(books.map(b => (b.id === editingId ? { ...form, id: editingId } : b)));
    } else {
      // Add new book (POST /api/books/add)
      const res = await axios.post('http://localhost:8080/api/books/add', form, {
        withCredentials: true, // Required for session cookies
      });
      setBooks([...books, res.data]);
    }
    setForm(initialForm);
    setEditingId(null);
  } catch (err) {
    setError('You do not have permission to add books');
  }
};

  const handleEdit = (book) => {
    setForm(book);
    setEditingId(book.id);
  };

const handleBorrow = async (book) => {
  try {
    // Step 1: Get logged-in user info from localStorage (frontend)
    // Assume you saved the user info on login like:
    // localStorage.setItem('user', JSON.stringify({ id: 123, name: 'Alice' }));
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      alert("User not logged in. Please login first.");
      return;
    }

    const userId = user.id;

    // Step 2: Proceed with borrowing
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);

    await axios.post(
      "http://localhost:8080/api/loans",
      {
        book: { id: book.id },
        user: { id: userId },
        loanDate: today.toISOString().split("T")[0],
        dueDate: dueDate.toISOString().split("T")[0],
      },
      {
       withCredentials: true, // Required for session cookies
      }
    );

    alert("Book borrowed successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to borrow book.");
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`, {
      withCredentials: true, // Required for session cookies
    });
      setBooks(books.filter(b => b.id !== id));
    } catch (err) {
      setError('Failed to delete book.');
    }
  };

  const filteredBooks = books.filter(b =>
    (b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search) ||
      b.category.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus ? b.status === filterStatus : true)
  );

  return (
    <div className="books-root">
      {/* Book Management Box */}
      <div className="books-box">
        <h2 className="books-title">Book Management</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div className="books-form-grid">
            <input
              placeholder="ISBN"
              value={form.isbn}
              onChange={e => setForm({ ...form, isbn: e.target.value })}
              required
              className="books-input"
            />
            <input
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              className="books-input"
            />
            <input
              placeholder="Author"
              value={form.author}
              onChange={e => setForm({ ...form, author: e.target.value })}
              required
              className="books-input"
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="books-input"
            />
            <input
              placeholder="Publication Year"
              type="number"
              value={form.publicationYear}
              onChange={e => setForm({ ...form, publicationYear: e.target.value })}
              className="books-input"
            />
            <input
              placeholder="Copies Available"
              type="number"
              value={form.copiesAvailable}
              onChange={e => setForm({ ...form, copiesAvailable: e.target.value })}
              className="books-input"
            />
            <select
              placeholder="Status"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="books-select"
            >
              <option value="">Select Status</option>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="reserved">Reserved</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button type="submit" className="books-btn">
                {editingId ? 'Update' : 'Add'} Book
              </button>
              {editingId && (
                <button
                  type="button"
                  className="books-btn books-btn-cancel"
                  onClick={() => { setForm(initialForm); setEditingId(null); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Book List Box */}
      <div className="books-box">
        <div className="books-search-row">
          <input
            placeholder="Search by title, author, ISBN, category"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="books-input"
            style={{ width: 320, marginRight: 0 }}
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="books-select"
            style={{ width: 180 }}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <table className="books-table">
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Publication Year</th>
              <th>Copies Available</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book.id}>
                <td>{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.publicationYear}</td>
                <td>{book.copiesAvailable}</td>
                <td>{book.status}</td>
                <td>
                      <button
                    onClick={() => handleBorrow(book)}
                    className="books-btn books-action-btn"
                  >
                    Borrow
                  </button>
                  <button
                    onClick={() => handleEdit(book)}
                    className="books-btn books-action-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="books-btn books-action-btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Books;