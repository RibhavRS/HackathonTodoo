import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

function Modal({ onClose, setWorkspaceCreators, workspaceCreators }) {
    const [workspaceName, setWorkspaceName] = useState('');
    const [description, setDescription] = useState('');

    const handleWorkspaceNameChange = (event) => {
        setWorkspaceName(event.target.value);
    };

    const handledescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const workspace = {
            title: workspaceName,
            description: description
        };

        const isWorkspaceNameExists = workspaceCreators.some(item => item.title === workspaceName);

        if (isWorkspaceNameExists) {
            toast.error('Workspace name already exists')
            return;
        }

        try {
            const response = await fetch('http://20.84.109.30:8090/api/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(workspace)
            });

            if (!response.ok) {
                throw new Error('Failed to add workspace');
            }

            const data = await response.json();
            setWorkspaceCreators(prevWorkspaceCreators => [...prevWorkspaceCreators, data]);
            onClose();
        } catch (error) {
            console.error('Error adding workspace:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg p-8">
                <div className="absolute top-0 right-0 m-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 focus:outline-none">
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <h2 className="text-xl font-semibold mb-4">Add Shared Workspace</h2>
                <div className="mb-6">
                    <ToastContainer />
                    <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-1">
                        Workspace Name
                    </label>
                    <input
                        type="text"
                        id="workspaceName"
                        value={workspaceName}
                        onChange={handleWorkspaceNameChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={handledescriptionChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none mr-2"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
