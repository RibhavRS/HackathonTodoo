import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import Modal from "./Modal";
import ModalNotification from "./ModalNotification";

function Sidebar({ setPage, workspaceCreators, setWorkspaceCreators, toggleModal, showModal, handlenotificationSubmit, handleinformationChange ,  handlereciepantsChange, reciepants, information,toggleNotificationModal,showModalNotification }) {

  const [sharedSpacesOpen, setSharedSpacesOpen] = useState(false);

  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://20.84.109.30:8090/api/lists/${workspaceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete workspace');
      }
      setWorkspaceCreators(prevWorkspaceCreators =>
        prevWorkspaceCreators.filter(item => item.id !== workspaceId)
      );
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  const toggleSharedSpaces = () => {
    setSharedSpacesOpen(!sharedSpacesOpen);
  };

  return (
    <div className="w-64 bg-gray-800 h-full">
      <div className="p-4">
        <ul className="space-y-2">
          <li>
            <button
              className="block py-2 px-4 text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
              onClick={() => setPage("Dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className="block py-2 px-4 text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
              onClick={() => setPage("TaskPage")}
            >
              My Task Page
            </button>
          </li>
          <li>
            <div className="flex justify-between items-center">
              <button
                className="block py-2 px-4 text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
                onClick={toggleSharedSpaces}
              >
                Taskbar
              </button>
              <button
                className="focus:outline-none text-white"
                onClick={toggleSharedSpaces}
              >
                {sharedSpacesOpen ? "-" : "+"}
              </button>
            </div>
            <div className={`border-t border-gray-700 my-2 ${sharedSpacesOpen ? 'block' : 'hidden'}`}>
              {workspaceCreators.length !== 0 &&
                workspaceCreators.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between transition-all duration-300 transform hover:scale-105"
                  >
                    <button
                      onClick={() => {
                        setPage(item.title);
                      }}
                      className="block py-2 px-8 text-sm text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
                    >
                      {item.title}
                    </button>
                    <MdDelete
                      onClick={() => handleDeleteWorkspace(item.id)}
                      size={20}
                      className="text-white cursor-pointer"
                    />
                  </div>
                ))}
            </div>
          </li>
          <li>
            <button
              onClick={toggleNotificationModal}
              onClose={toggleModal}
              // onNotification={onNotification}
              className="block py-2 px-4 text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
            >
              Notify
            </button>
          </li>
        </ul>
      </div>
      {showModal && (
        <Modal onClose={toggleModal} setWorkspaceCreators={setWorkspaceCreators} workspaceCreators={workspaceCreators} />
      )}
      {showModalNotification && (
        <ModalNotification   handlenotificationSubmit={handlenotificationSubmit}
              handleinformationChange={handleinformationChange}
              handlereciepantsChange={handlereciepantsChange} 
              toggleNotificationModal={toggleNotificationModal}
              reciepants={reciepants} information={information}/>
      )}
    </div>
  );
}

export default Sidebar;
