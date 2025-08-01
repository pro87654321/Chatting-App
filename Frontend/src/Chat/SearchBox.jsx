// SearchBox.jsx
import React, { useState } from 'react';
import axios from 'axios';

function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = async (e) => {
    const search = e.target.value;
    setQuery(search);
    setError(null);

    if (search.trim().length === 0) {
      onSearch([]);
      return;
    }

    try {
      setLoading(true);
      const email = localStorage.getItem('loggedInEmail');
      const currentUserRes = await axios.get(
        `http://localhost:8080/api/auth/users/email?email=${encodeURIComponent(email)}`
      );
      console.log(currentUserRes.data);
      const currentUserId = currentUserRes.data.id;

      const response = await axios.get(
        `http://localhost:8080/api/auth/users/search?query=${encodeURIComponent(search)}&excludeId=${currentUserId}`
      );

      const users = response.data;
      console.log(users);
          const chatFormatted = users.map((user) => ({
      id: user.id,
      name: user.userName || user.name,
      isGroup: false,
      user,
    }));


      onSearch(chatFormatted);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
      onSearch([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-300">
      <input
        type="text"
        placeholder="Search or start new chat"
        value={query}
        onChange={handleChange}
        className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none"
      />
      {loading && <div className="text-xs text-gray-500 mt-1">Searching...</div>}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
}

export default SearchBox;
