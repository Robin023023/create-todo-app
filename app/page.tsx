"use client"
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios("http://localhost:4000/api/users/")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, age: parseInt(age) };

    axios.post("http://localhost:4000/api/users", newUser)
      .then((response) => {
        setData([...data, response.data]);
        setName('');
        setAge('');
        alert("data add successfull")
      })
      .catch((error) => {
        console.error("Error adding user:", error);
        setError("Failed to add user");
      });
  };

  const handleEdit = (userId) => {
    const selectedUser = data.find(user => user.id === userId);
    setSelectedUserId(userId);
    setName(selectedUser.name);
    setAge(selectedUser.age.toString());
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { name, age: parseInt(age) };

    axios.patch(`http://localhost:4000/api/users/${selectedUserId}`, updatedUser)
      .then(() => {
        const updatedData = data.map(user => {
          if (user.id === selectedUserId) {
            return { ...user, ...updatedUser };
          }
          return user;
        });
        setData(updatedData);
        setName('');
        setAge('');
        setSelectedUserId(null);
        alert("Your data edited")
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setError("Failed to update user");
      });
  };

  const handleDelete = (userId) => {
    axios.delete(`http://localhost:4000/api/users/${userId}`)
      .then(() => {
        setData(data.filter(user => user.id !== userId));
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setError("Failed to delete user");
      });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!data || data.length === 0) return <p>No profile data</p>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <form onSubmit={selectedUserId ? handleUpdate : handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <button type="submit">{selectedUserId ? 'Update' : 'Submit'}</button>
      </form>

      <div>
        {data.map((user) => (
          <div key={user.id}>
            <h1>Name: {user.name}</h1>
            <h3>Age: {user.age}</h3>
            <button onClick={() => handleEdit(user.id)}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;