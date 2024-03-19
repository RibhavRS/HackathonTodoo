import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import Modal from "../components/Modal";

function Dashboard({ workspaceCreators, setWorkspaceCreators, setPage }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleDeleteWorkspace = (workspaceName) => {
    setWorkspaceCreators((prevWorkspaceCreators) =>
      prevWorkspaceCreators.filter(
        (item) => item.workspaceName !== workspaceName
      )
    );
  };

  const handleWorkspaceClick = (workspaceName) => {
    setPage(workspaceName);
  };

  const getSolidColor = () => {
    // Generate a random light color code
    const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
    return color;
  };

  return (
    <div className="w-full bg-gray-200 h-full flex flex-col justify-start items-start border-l-4 border-black p-4">
      <button
        onClick={toggleModal}
        className="block py-2 px-4 text-white rounded bg-blue-500 hover:bg-blue-600 hover:text-white text-left mb-4"
      >
        Add New List
      </button>

      <div className="max-w-4xl w-full">
        <ul className="grid grid-cols-3 gap-4 w-full">
          {workspaceCreators.length !== 0 &&
            workspaceCreators.map((item, index) => (
              <button
                key={`${item.workspaceName}-${index}`}
                className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 flex flex-col justify-center text-black border border-gray-300"
                style={{
                  backgroundColor: getSolidColor(),
                }}
                onClick={() => {
                  handleWorkspaceClick(item.workspaceName);
                }}
              >
                <div className="p-4 text-center opacity-100 transition-opacity duration-300 hover:opacity-0">
                  <h3 className="text-lg font-semibold mb-2 text-white ">
                    {item.workspaceName}
                  </h3>
                  <p className="text-sm text-white">{item.description}</p>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-50 rounded-lg"></div>
                {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <h3 className="text-lg font-semibold text-white">
                    {item.workspaceName}
                  </h3>
                </div> */}
                <div className="flex justify-end p-2">
                  <MdDelete
                    onClick={() => handleDeleteWorkspace(item.workspaceName)}
                    size={20}
                    className="text-black cursor-pointer"
                  />
                </div>
              </button>
            ))}
        </ul>
      </div>

      {showModal && (
        <Modal
          setWorkspaceCreators={setWorkspaceCreators}
          onClose={toggleModal}
        />
      )}

      {selectedWorkspace && (
        <div>
          {/* Render your component here based on selectedWorkspace */}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
