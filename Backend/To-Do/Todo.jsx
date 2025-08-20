import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/todos';

function Todo() {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Fetch all todos when component mounts or after changes
  const fetchTodos = async (query = '') => {
    try {
      setError('');
      const url = query ? ${API_URL}?query=${encodeURIComponent(query)} : API_URL;
      const res = await fetch(url);
      const data = await res.json();
      setTodos(data);
    } catch {
      setError('Error fetching todos');
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  // Handle add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? ${API_URL}/${editId} : API_URL;
      const body = JSON.stringify({ title, completed });
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!res.ok) throw new Error('Failed');
      setTitle('');
      setCompleted(false);
      setEditId(null);
      fetchTodos();
    } catch {
      setError('Error saving todo');
    }
  };

  // Start editing a todo
  const handleEdit = (todo) => {
    setTitle(todo.title);
    setCompleted(todo.completed);
    setEditId(todo.id);
  };

  // Delete a todo
  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await fetch(${API_URL}/${id}, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      fetchTodos();
    } catch {
      setError('Error deleting todo');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchTodos(e.target.value);
  };

  return (
    <div>
      <h2>Todo Management</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <label style={{marginLeft:'1em'}}>
          Completed:
          <input
            type="checkbox"
            checked={completed}
            onChange={e => setCompleted(e.target.checked)}
          />
        </label>
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
        {editId && <button type="button" onClick={() => {setEditId(null);setTitle('');setCompleted(false);}}>Cancel</button>}
      </form>
      <br />
      <input
        type="text"
        placeholder="Search todos"
        value={search}
        onChange={handleSearch}
      />
      <ul>
        {todos.length ? todos.map(todo => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <span style={{marginLeft:'1em'}}>({todo.completed ? 'Done' : 'Pending'})</span>
            <button style={{marginLeft:'1em'}} onClick={() => handleEdit(todo)}>Edit</button>
            <button style={{marginLeft:'0.5em'}} onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        )) : <li>No todos found</li>}
      </ul>
    </div>
  );
}

export default Todo;