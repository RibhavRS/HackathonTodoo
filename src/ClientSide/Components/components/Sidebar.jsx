import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import Modal from "./Modal";
import ModalNotification from "./ModalNotification";

function Sidebar({ setPage, workspaceCreators, setWorkspaceCreators }) {
  const [showModal, setShowModal] = useState(false);
  const [showModalNotification, setShowModalNotification] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleNotificationModal = () => {
    setShowModalNotification(!showModalNotification);
  };

  const handleDeleteWorkspace = (workspaceName) => {
    setWorkspaceCreators((prevWorkspaceCreators) =>
      prevWorkspaceCreators.filter(
        (item) => item.workspaceName !== workspaceName
      )
    );
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
              My Tasks
            </button>
          </li>
          <li>
            <button
              onClick={toggleNotificationModal}
              className="block py-2 px-4 text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
            >
              Notify
            </button>
          </li>
          <li>
            <button
              onClick={toggleModal}
              className="block py-2 px-4 text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
            >
              Shared Spaces
            </button>
            <div className="border-t border-gray-700 my-2"></div>
          </li>
          {workspaceCreators.length !== 0 &&
            workspaceCreators.map((item) => (
              <li
                key={item.workspaceName}
                className="flex items-center justify-between transition-all duration-300 transform hover:scale-105"
              >
                <button
                  onClick={() => {
                    setPage(item.workspaceName);
                  }}
                  className="block py-2 px-8 text-sm text-white rounded hover:bg-gray-700 hover:text-blue-400 w-full text-left"
                >
                  {item.workspaceName}({item.collaborators})
                </button>
                <MdDelete
                  onClick={() => handleDeleteWorkspace(item.workspaceName)}
                  size={20}
                  className="text-white cursor-pointer"
                />
              </li>
            ))}
        </ul>
      </div>
      {showModal && (
        <Modal
          setWorkspaceCreators={setWorkspaceCreators}
          onClose={toggleModal}
        />
      )}
      {showModalNotification && (
        <ModalNotification onClose={toggleNotificationModal} />
      )}
    </div>
  );
}

export default Sidebar;
