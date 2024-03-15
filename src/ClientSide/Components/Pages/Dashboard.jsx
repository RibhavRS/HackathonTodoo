import React, { useState } from 'react';
import AddTodo from '../components/AddTodo';
import CompletedTasks from '../components/CompletedTasks';
import Statistics from '../components/Statistics';
import Workspace from '../components/Workspace';

function Dashboard({ todos, setTodos, handleTaskEdit, pendingTasks }) {
    const [todoText, setTodoText] = useState('');
    const [priority, setPriority] = useState('medium');
    const [nextId, setNextId] = useState(1);
    const [deadline, setDeadline] = useState('');

    const handleAddTodo = () => {
        if (todoText.trim() === '' || deadline.trim() === '') {
            return;
        }

        const newTodo = {
            id: nextId,
            title: todoText,
            priority: priority,
            deadline: deadline,
            description: '',
            completed: false,
            date: new Date().toISOString().slice(0, 10)
        };

        setTodos([...todos, newTodo]);
        setTodoText('');
        setPriority('medium');
        setNextId(nextId + 1);
    };

    const completedTasks = todos.filter(todo => todo.completed);
    const totalCompletedTasks = completedTasks.length;
    const totalPendingTasks = pendingTasks.length;
    const totalTasks = totalCompletedTasks + totalPendingTasks;
    const completedPercentage = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1">
                <div className="flex-grow p-8">
                    <AddTodo
                        todoText={todoText}
                        setTodoText={setTodoText}
                        priority={priority}
                        setPriority={setPriority}
                        Deadline={deadline}
                        setDeadline={setDeadline}
                        handleAddTodo={handleAddTodo}
                    />

                    <Statistics
                        totalPendingTasks={totalPendingTasks}
                        totalCompletedTasks={totalCompletedTasks}
                        completedPercentage={completedPercentage}
                    />

                    <Workspace pendingTasks={pendingTasks} handleTaskEdit={handleTaskEdit} />

                    <CompletedTasks completedTasks={completedTasks} handleTaskEdit={handleTaskEdit} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
