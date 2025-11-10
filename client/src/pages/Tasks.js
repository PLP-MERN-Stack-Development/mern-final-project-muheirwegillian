import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import './Tasks.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        priority: ''
    });

    useEffect(() => {
        fetchTasks();
    }, [filters]);

    const fetchTasks = async () => {
        try {
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;

            const response = await tasksAPI.getAll(params);
            setTasks(response.data.data || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="tasks-page">
            <div className="page-header">
                <h1>Tasks</h1>
                <div className="filters">
                    <select
                        name="status"
                        className="form-select"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                    </select>
                    <select
                        name="priority"
                        className="form-select"
                        value={filters.priority}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="card text-center">
                    <p>No tasks found</p>
                </div>
            ) : (
                <div className="tasks-list">
                    {tasks.map(task => (
                        <Link key={task._id} to={`/tasks/${task._id}`} className="task-card">
                            <div className="task-header">
                                <h3>{task.title}</h3>
                                <div className="task-badges">
                                    <span className={`badge badge-${task.status}`}>{task.status}</span>
                                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                                </div>
                            </div>
                            <p className="task-description">{task.description || 'No description'}</p>
                            <div className="task-footer">
                                <span className="task-project">{task.project?.name || 'No project'}</span>
                                {task.assignedTo && (
                                    <span className="task-assignee">{task.assignedTo.name}</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Tasks;

