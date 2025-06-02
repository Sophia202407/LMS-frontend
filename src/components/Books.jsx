import React, { useState, useEffect } from 'react';
import axios from 'axios';

const initialForm = {
  isbn: '',
  title: '',
  author: '',
  category: '',
  publicationYear: '',
  copiesAvailable: '',
  status: 'available', // available, borrowed, reserved
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState('');

  // Fetch books from backend
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

  // Add or update book
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/books/${editingId}`, form);
        setBooks(books.map(b => (b.id === editingId ? { ...form, id: editingId } : b)));
      } else {
        const res = await axios.post('http://localhost:8080/api/books', form);
        setBooks([...books, res.data]);
      }
      setForm(initialForm);
      setEditingId(null);
    } catch (err) {
      setError('Failed to save book.');
    }
  };

  // Edit book
  const handleEdit = (book) => {
    setForm(book);
    setEditingId(book.id);
  };

  // Delete book
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`);
      setBooks(books.filter(b => b.id !== id));
    } catch (err) {
      setError('Failed to delete book.');
    }
  };

  // Filter and search
  const filteredBooks = books.filter(b =>
    (b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search) ||
      b.category.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus ? b.status === filterStatus : true)
  );

  return (
    <div>
      <h2>Book Management</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          placeholder="ISBN"
          value={form.isbn}
          onChange={e => setForm({ ...form, isbn: e.target.value })}
          required
        />
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Publication Year"
          type="number"
          value={form.publicationYear}
          onChange={e => setForm({ ...form, publicationYear: e.target.value })}
        />
        <input
          placeholder="Copies Available"
          type="number"
          value={form.copiesAvailable}
          onChange={e => setForm({ ...form, copiesAvailable: e.target.value })}
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
          <option value="reserved">Reserved</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} Book</button>
        {editingId && (
          <button type="button" onClick={() => { setForm(initialForm); setEditingId(null); }}>
            Cancel
          </button>
        )}
      </form>

      <div style={{ marginBottom: 10 }}>
        <input
          placeholder="Search by title, author, ISBN, category"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="borrowed">Borrowed</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book.id)} style={{ marginLeft: 5, color: 'red' }}>Delete</button>
                {/* You can add a "View" button/modal here if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;