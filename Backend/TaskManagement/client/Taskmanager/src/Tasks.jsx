import React, { useState } from "react";
import './App.css';

const API = "http://localhost:3000/tasks"; // Adjust if backend runs elsewhere

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", status: "", dueDate: "" });
  const [updateId, setUpdateId] = useState("");
  const [updateForm, setUpdateForm] = useState({ title: "", description: "", status: "", dueDate: "" });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
        setError("");
      } else {
        setTasks([]);
        setError(data?.error || "Unexpected response");
      }
    } catch (err) {
      setTasks([]);
      setError("Failed to fetch tasks");
    }
  };

  // Create new task
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title) {
      setError("Title is required.");
      return;
    }
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body?.error || "Failed to create task");
        return;
      }
      setForm({ title: "", description: "", status: "", dueDate: "" });
      setError("");
      fetchTasks();
    } catch {
      setError("Failed to create task");
    }
  };

  // Update task by id
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!updateId) {
      setError("Enter Task ID to update");
      return;
    }
    try {
      const res = await fetch(`${API}/${updateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateForm),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body?.error || "Failed to update task");
        return;
      }
      setUpdateId("");
      setUpdateForm({ title: "", description: "", status: "", dueDate: "" });
      setError("");
      fetchTasks();
    } catch {
      setError("Failed to update task");
    }
  };

  // Search tasks by title
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      let url = API;
      if (search.trim()) {
        url += `?title=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
      setError("");
    } catch {
      setTasks([]);
      setError("Search failed");
    }
  };

  // Delete task by id
  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  // Reusable handleChange helpers
  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleUpdateFormChange = (e) => setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });

  // Fetch all tasks on mount
  React.useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Task Manager</h1>

      {error && <div className="mb-4 text-red-600 font-bold">{error}</div>}

      {/* CREATE FORM */}
      <form onSubmit={handleCreate} className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold mb-2">Create Task</h2>
        <div className="flex gap-2 flex-wrap">
          <input name="title" value={form.title} onChange={handleFormChange} placeholder="Title" required className="input border rounded input-bordered flex-1" />
          <input name="description" value={form.description} onChange={handleFormChange} placeholder="Description" className="input border rounded input-bordered flex-1" />
          <input name="status" value={form.status} onChange={handleFormChange} placeholder="Status" className="input border rounded input-bordered w-36" />
          <input name="dueDate" type="date" value={form.dueDate} onChange={handleFormChange} className="input input-bordered w-44" />
          <button type="submit" className="btn btn-primary border-amber-700 bg-blue-500 rounded h-8 w-20 hover:bg-blue-800 text-white">Create</button>
        </div>
      </form>

      {/* UPDATE FORM */}
      <form onSubmit={handleUpdate} className="mb-8 space-y-3">
        <h2 className="text-xl font-semibold mb-2">Update Task By ID</h2>
        <div className="flex gap-2 flex-wrap">
          <input value={updateId} onChange={e => setUpdateId(e.target.value)} placeholder="Task ID" required className="input input-bordered w-3/6" />
          <input name="title" value={updateForm.title} onChange={handleUpdateFormChange} placeholder="Title" className="input input-bordered w-36" />
          <input name="description" value={updateForm.description} onChange={handleUpdateFormChange} placeholder="Description" className="input input-bordered w-36" />
          <input name="status" value={updateForm.status} onChange={handleUpdateFormChange} placeholder="Status" className="input input-bordered w-28" />
          <input name="dueDate" type="date" value={updateForm.dueDate} onChange={handleUpdateFormChange} className="input input-bordered w-32" />
          <button type="submit" className="btn btn-primary border-amber-700 bg-blue-500 rounded h-8 w-20 hover:bg-blue-800 text-white">Update</button>
        </div>
      </form>

      {/* SEARCH */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3 flex-wrap items-center">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title..." className="input input-bordered flex-1" />
        <button type="submit" className="btn btn-primary border-amber-700 bg-blue-500 rounded h-8 w-20 hover:bg-blue-800 text-white">Search</button>
        <button type="button" className="btn btn-primary border-amber-700 bg-blue-500 rounded h-8 w-30 hover:bg-blue-800 text-white" onClick={fetchTasks}>Fetch All Tasks</button>
      </form>

      <h2 className="text-xl font-bold my-4 text-blue-600">Tasks</h2>
      <button onClick={fetchTasks} className="btn btn-outline mb-4">Refresh</button>
      {!Array.isArray(tasks) || tasks.length === 0 ? <p className="text-gray-500">No tasks</p> : (
        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task._id} className="bg-gray-50 p-4 rounded shadow flex flex-col gap-2">
              <div className="font-bold text-lg">{task.title}</div>
              {task.description && <div>Description: <span className="text-gray-700">{task.description}</span></div>}
              <div>Status: <span className="text-gray-700">{task.status || "-"}</span></div>
              <div>Due: <span className="text-gray-700">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</span></div>
              <div className="text-gray-400 text-xs break-all">ID: {task._id}</div>
              <button onClick={() => handleDelete(task._id)} className="btn btn-error btn-sm self-end">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;