import React, { useEffect, useState } from "react";

const API_URL = "/users";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchUser) return;
    try {
      const response = await fetch(`${API_URL}/${searchUser}`);
      if (response.ok) {
        const data = await response.json();
        setFoundUser(data);
      } else {
        setFoundUser(null);
      }
    } catch (error) {
      console.error("Error searching user:", error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: password })
      });
      if (response.ok) {
        fetchUsers();
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUsername(user.username);
    setNewPassword("");
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;
    try {
      const response = await fetch(`${API_URL}/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editUser.id, username: newUsername, passwordHash: newPassword })
      });
      if (response.ok) {
        fetchUsers();
        setEditUser(null);
        setNewUsername("");
        setNewPassword("");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Add User</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 mr-2" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mr-2" />
        <button onClick={handleAddUser} className="bg-blue-500 text-white p-2">Add</button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Search User</h2>
        <input type="text" placeholder="Username" value={searchUser} onChange={(e) => setSearchUser(e.target.value)} className="border p-2 mr-2" />
        <button onClick={handleSearch} className="bg-green-500 text-white p-2">Search</button>
        {foundUser && <div className="mt-2">Found: {foundUser.username}</div>}
      </div>
      
      <h2 className="text-xl font-semibold">User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between p-2 border-b">
            {user.username}
            <div>
              <button onClick={() => handleEditUser(user)} className="bg-yellow-500 text-white p-1 mr-2">Edit</button>
              <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white p-1">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editUser && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold">Edit User</h2>
          <input type="text" placeholder="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="border p-2 mr-2" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border p-2 mr-2" />
          <button onClick={handleUpdateUser} className="bg-blue-500 text-white p-2">Update</button>
        </div>
      )}
    </div>
  );
}