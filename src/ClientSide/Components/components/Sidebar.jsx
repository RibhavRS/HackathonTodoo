import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import Modal from "./Modal";
import ModalNotification from "./ModalNotification";

function Sidebar({ setPage, workspaceCreators, setWorkspaceCreators, toggleModal, showModal, handlenotificationSubmit, handleinformationChange ,  handlereciepantsChange, reciepants, information,toggleNotificationModal,showModalNotification }) {

  const [sharedSpacesOpen, setSharedSpacesOpen] = useState(false);

  const handleDeleteWorkspace = (workspaceName) => {
    setWorkspaceCreators((prevWorkspaceCreators) =>
      prevWorkspaceCreators.filter(
        (item) => item.workspaceName !== workspaceName
      )
    );
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
                workspaceCreators.map((item, index) => (
                  <div
                    key={`${item.workspaceName}-${index}`}
                    className="flex items-center justify-between transition-all duration-300 transform hover:scale-105"
                  >
                    <button
                      onClick={() => {
                        setPage(item.workspaceName);
                      }}
                      className="block py-2 px-8 text-sm text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
                    >
                      {item.workspaceName}
                    </button>
                    <MdDelete
                      onClick={() => handleDeleteWorkspace(item.workspaceName)}
                      size={20}
                      className="text-white cursor-pointer"
                    />
                  </div>
                ))}
            </div>
          </li>
          <li>
            <button
              className="block py-2 px-4 text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
              onClick={() => setPage("TaskPage")}
            >
              My Tasks
            </button>
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
