import { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';

function Dashboard({ workspaceCreators,setWorkspaceCreators, setPage, toggleModal }) {

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://20.84.109.30:8090/api/lists/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch workspaces');
        }
        const data = await response.json();
        setWorkspaceCreators(data);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
    fetchWorkspaces();
  }, []);

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


  const handleWorkspaceClick = (workspaceName, listId) => {
    setPage(workspaceName);
    localStorage.setItem('listId',listId)
  };

  const getSolidColor = () => {
    const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
    return color;
  };

  return (
    <div className="w-full bg-gray-200 h-screen flex flex-col justify-start items-start border-l-4 border-black p-4">
      <button
        onClick={toggleModal}
        className="block py-2 px-4 text-white rounded bg-blue-900 hover:bg-red-600 hover:text-white text-left mb-4"
      >
        Add New List
      </button>

      <div className="max-w-4xl w-full">
        <ul className="grid grid-cols-3 gap-4 w-full">
          {workspaceCreators.map((item) => (
            <div
              key={item.id}
              className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 flex flex-col justify-center text-black border border-gray-300"
              style={{
                backgroundColor: getSolidColor(),
              }}
            >
              <button onClick={() => handleWorkspaceClick(item.title, item.id)}>
                <div className="p-4 text-center opacity-100 transition-opacity duration-300 hover:opacity-0">
                  <h3 className="text-lg font-semibold mb-2 text-white ">{item.title}</h3>
                  <p className="text-sm text-white">{item.description}</p>
                </div>
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-50 rounded-lg"></div>
              </button>
              <button className="absolute top-0 right-0 mt-2 mr-2" onClick={() => handleDeleteWorkspace(item.id)}>
                <MdDelete size={20} className="text-white cursor-pointer" />
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
