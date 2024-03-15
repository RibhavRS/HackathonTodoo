import React, { useState } from 'react';

function ModalNotification({ onClose}) {
 
    const [reciepants, setreciepants] = useState('');
    const [information, setinformation] = useState('');

    const handleinformationChange = (event) =>{
        setinformation(event.target.value);
    }

    const handlereciepantsChange = (event) => {
        setreciepants(event.target.value);
    };

    const handleSubmit = () => {
        onClose(); 
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
                <h2 className="text-xl font-semibold mb-4">Reciepants</h2>
                <div className="mb-6">
                    <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                    </label>
                    <input
                        type="text "
                        id="reciepants"
                        value={reciepants}
                        onChange={handlereciepantsChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700 mb-1">
                        Alert Information
                    </label>
                    <input
                        type="text"
                        id="information"
                        value={information}
                        onChange={handleinformationChange}
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

export default ModalNotification;
