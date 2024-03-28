
import React, { useState , useEffect} from "react";

function AddTodo({
    todoText,
    setTodoText,
    priority,
    setPriority,
    handleAddTodo,
    Deadline,
    setDeadline,
}) {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setCurrentDate(currentDate);
    }, []);

    return (
        <div className="mb-6 bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex-grow">Add Todo</h2>
                <span className="text-gray-300">{currentDate}</span>
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="text"
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    className="border border-gray-300 rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow bg-gray-700 text-white"
                    placeholder="Enter Todo"
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border border-gray-300 rounded-r px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 bg-gray-700 text-white"
                >
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>
                <input
                    type="datetime-local"
                    value={Deadline}
                    onChange={(e) =>
                        setDeadline(new Date(e.target.value).toLocaleString())
                    }
                    className="border border-gray-300 rounded-r px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 bg-gray-700 text-white"
                    placeholder="Enter Todo"
                />
                <button
                    onClick={handleAddTodo}
                    className="bg-blue-500 text-white rounded px-4 py-2 ml-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Add Todo
                </button>
            </div>
        </div>
    );
}

export default AddTodo;
