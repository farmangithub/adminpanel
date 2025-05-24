import React, { useState } from "react";

const dummyUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", contact: "123-456-7890" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", contact: "987-654-3210" },
  { id: 3, name: "Alex Johnson", email: "alex@example.com", contact: "555-666-7777" },
];

export default function Users() {
  const [users] = useState(dummyUsers);

  return (
    <div style={{ padding: "20px", flexGrow: 1 }}>
      <h1 style={{ fontWeight: "bold", color: "#007bff" }}>Users</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#007bff", color: "white" }}>
          <tr>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Contact</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, email, contact }) => (
            <tr key={id}>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{name}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{email}</td>
              <td style={{ padding: "10px", border: "1px solid #ddd" }}>{contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
