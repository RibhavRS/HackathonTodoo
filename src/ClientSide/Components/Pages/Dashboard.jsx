import { useEffect } from 'react';
import { MdDelete } from 'react-icons/md';

function Dashboard({ workspaceCreators, setWorkspaceCreators, setPage, toggleModal }) {
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch('https://65ee234e08706c584d9b1c74.mockapi.io/reactcrud/workspace');
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
  }, [setWorkspaceCreators]);

  const handleDeleteWorkspace = async (workspaceName) => {
    try {
      const response = await fetch(`https://65ee234e08706c584d9b1c74.mockapi.io/reactcrud/workspace/${workspaceName}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete workspace');
      }
      setWorkspaceCreators(prevWorkspaceCreators =>
        prevWorkspaceCreators.filter(item => item.workspaceName !== workspaceName)
      );
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  const handleWorkspaceClick = (workspaceName) => {
    setPage(workspaceName);
  };

  const getSolidColor = () => {
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
          {workspaceCreators && workspaceCreators.length !== 0 &&
            workspaceCreators.map((item, index) => (
              <div
                key={`${item.workspaceName}-${index}`}
                className="relative rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 flex flex-col justify-center text-black border border-gray-300"
                style={{
                  backgroundColor: getSolidColor(),
                }}
              >
                <button onClick={() => handleWorkspaceClick(item.workspaceName)}>
                  <div className="p-4 text-center opacity-100 transition-opacity duration-300 hover:opacity-0">
                    <h3 className="text-lg font-semibold mb-2 text-white ">{item.workspaceName}</h3>
                    <p className="text-sm text-white">{item.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-50 rounded-lg"></div>
                </button>
                <button className="absolute top-0 right-0 mt-2 mr-2" onClick={() => handleDeleteWorkspace(item.workspaceName)}>
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
