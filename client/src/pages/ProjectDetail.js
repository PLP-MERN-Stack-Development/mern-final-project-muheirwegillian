import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI, tasksAPI, usersAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import './ProjectDetail.css';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: ''
    });
    const [memberForm, setMemberForm] = useState({ userId: '' });
    const { socket, joinProject, leaveProject } = useSocket();

    useEffect(() => {
        fetchProject();
        fetchUsers();
        if (id) {
            joinProject(id);
        }

        if (socket) {
            socket.on('task-created', (task) => {
                if (task.project === id) {
                    setTasks(prev => [task, ...prev]);
                }
            });

            socket.on('task-updated', (task) => {
                setTasks(prev => prev.map(t => t._id === task._id ? task : t));
            });

            socket.on('task-deleted', ({ id: taskId }) => {
                setTasks(prev => prev.filter(t => t._id !== taskId));
            });

            socket.on('project-updated', (updatedProject) => {
                if (updatedProject._id === id) {
                    setProject(updatedProject);
                }
            });
        }

        return () => {
            if (id) {
                leaveProject(id);
            }
            if (socket) {
                socket.off('task-created');
                socket.off('task-updated');
                socket.off('task-deleted');
                socket.off('project-updated');
            }
        };
    }, [id, socket]);

    const fetchProject = async () => {
        try {
            const response = await projectsAPI.getById(id);
            setProject(response.data.data);
            setTasks(response.data.data.tasks || []);
        } catch (error) {
            console.error('Error fetching project:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await usersAPI.getAll();
            setUsers(response.data.data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            await tasksAPI.create({ ...taskForm, project: id });
            setShowTaskModal(false);
            setTaskForm({ title: '', description: '', status: 'todo', priority: 'medium', assignedTo: '' });
            fetchProject();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        }
    };

    const handleMemberSubmit = async (e) => {
        e.preventDefault();
        try {
            await projectsAPI.addMember(id, memberForm.userId);
            setShowMemberModal(false);
            setMemberForm({ userId: '' });
            fetchProject();
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Failed to add member');
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!project) {
        return <div className="text-center">Project not found</div>;
    }

    return (
        <div className="project-detail">
            <div className="project-header">
                <div>
                    <h1>{project.name}</h1>
                    <p className="project-description">{project.description || 'No description'}</p>
                    <div className="project-badges">
                        <span className={`badge badge-${project.status}`}>{project.status}</span>
                        <span className={`badge badge-${project.priority}`}>{project.priority}</span>
                    </div>
                </div>
                <div className="project-actions">
                    <button className="btn btn-outline" onClick={() => setShowMemberModal(true)}>
                        Add Member
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
                        + New Task
                    </button>
                </div>
            </div>

            <div className="project-info">
                <div className="card">
                    <h3>Members</h3>
                    <div className="members-list">
                        {project.members && project.members.length > 0 ? (
                            project.members.map(member => (
                                <div key={member._id} className="member-item">
                                    {member.name} ({member.email})
                                </div>
                            ))
                        ) : (
                            <p>No members yet</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="tasks-section">
                <h2>Tasks</h2>
                {tasks.length === 0 ? (
                    <div className="card text-center">
                        <p>No tasks yet. Create your first task!</p>
                    </div>
                ) : (
                    <div className="tasks-list">
                        {tasks.map(task => (
                            <Link key={task._id} to={`/tasks/${task._id}`} className="task-item">
                                <div>
                                    <h4>{task.title}</h4>
                                    <p>{task.description || 'No description'}</p>
                                </div>
                                <div className="task-meta">
                                    <span className={`badge badge-${task.status}`}>{task.status}</span>
                                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {showTaskModal && (
                <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Create New Task</h2>
                        <form onSubmit={handleTaskSubmit}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-input"
                                    value={taskForm.title}
                                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className="form-textarea"
                                    value={taskForm.description}
                                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={taskForm.status}
                                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="review">Review</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                    className="form-select"
                                    value={taskForm.priority}
                                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Assign To</label>
                                <select
                                    className="form-select"
                                    value={taskForm.assignedTo}
                                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowTaskModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showMemberModal && (
                <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Member</h2>
                        <form onSubmit={handleMemberSubmit}>
                            <div className="form-group">
                                <label className="form-label">User</label>
                                <select
                                    className="form-select"
                                    value={memberForm.userId}
                                    onChange={(e) => setMemberForm({ userId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowMemberModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;

