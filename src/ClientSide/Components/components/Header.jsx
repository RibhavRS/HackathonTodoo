import React from 'react';

function Header({ user, onLogout }) {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div>
        <span className="text-lg">Hey, {user}</span>
      </div>
      <button
        onClick={onLogout}
        className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </header>
  );
}

export default Header;
