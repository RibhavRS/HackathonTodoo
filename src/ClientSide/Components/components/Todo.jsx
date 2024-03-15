
import React, { useState } from 'react';

function Todo() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState('');

  const handleAddTodo = () => {
    setTodos([...todos, todoText]);
    setTodoText('');
  };

  return (
    <div className="flex-grow p-4">
      <h1 className="text-xl font-bold mb-4">Todo List</h1>
      <div className="flex">
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          className="border border-gray-300 rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
        />
        <button
          onClick={handleAddTodo}
          className="bg-blue-500 text-white rounded-r px-4 py-2 ml-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Todo
        </button>
      </div>
      <ul className="mt-4">
        {todos.map((todo, index) => (
          <li key={index} className="py-2 border-b border-gray-200">{todo}</li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
