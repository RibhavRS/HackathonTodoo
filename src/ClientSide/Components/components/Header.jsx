import React from 'react';

function Header({ user, onLogout, notificationCount, toggleModal }) {
  const handleNotificationClick = () => {
    toggleModal();
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div>
        <span className="text-lg">Hey, {user}</span>
      </div>
      <div className="flex items-center"> {/* Align items in a row */}
        {notificationCount > 0 && (
          <div className="relative mr-4"> {/* Add margin-right for spacing */}
            <button
              onClick={handleNotificationClick}
              className="bg-gray-900 text-white py-1 px-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.828 19.243a1 1 0 01-1.414 0l-1.414-1.414a7 7 0 10-9.9 0L6.586 17.83a1 1 0 01-1.414 0l-1.414-1.414M19 14v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-1m14 0a4 4 0 11-8 0v-1"
                />
              </svg>
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {notificationCount}
              </span>
            </button>
          </div>
        )}
        <button
          onClick={onLogout}
          className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
