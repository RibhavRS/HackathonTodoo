import React, { useState }  from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaBell } from 'react-icons/fa';
import { MdDelete } from "react-icons/md";

function Header({ user, onLogout, tnmodal, notifications, handleDeletenotification }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setShowNotifications(false); 
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    onLogout();
  };



  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="mr-auto">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-white">Task</span>
            <span className="text-3xl font-bold text-red-600">Buddy</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <button
            onClick={tnmodal}
            className="bg-gray-900 text-white py-1 px-2 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 relative"
          >
            <FaBell size={24} onClick={handleNotificationClick} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-8 w-48 bg-white shadow-lg rounded text-black">
              {notifications.map((notification, index) => (
                <div key={index} className="p-2 border-b flex justify-between items-center">
                <span>{notification}</span>
                <MdDelete
                  onClick={() => handleDeletenotification(index)}
                  size={20}
                  className="text-black cursor-pointer"
                />
              </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={handleDropdownToggle}
            className="bg-gray-900 text-white py-1 px-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 relative"
          >
            <BsFillPersonFill size={24} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded">
              <div className="p-2">
                <p className="text-gray-800 text-sm font-medium mb-2">{user}</p>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
