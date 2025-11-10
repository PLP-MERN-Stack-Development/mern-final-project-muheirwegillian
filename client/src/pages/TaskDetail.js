import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tasksAPI, usersAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import './TaskDetail.css';

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [commentText, setCommentText] = useState('');
    const { socket, joinProject, leaveProject } = useSocket();

    useEffect(() => {
        fetchTask();
        fetchUsers();
    }, [id]);

    useEffect(() => {
        if (task?.project?._id) {
            joinProject(task.project._id);
        }

        if (socket) {
            socket.on('task-updated', (updatedTask) => {
                if (updatedTask._id === id) {
                    setTask(updatedTask);
                }
            });

            socket.on('task-comment-added', (updatedTask) => {
                if (updatedTask._id === id) {
                    setTask(updatedTask);
                }
            });
        }

        return () => {
            if (task?.project?._id) {
                leaveProject(task.project._id);
            }
            if (socket) {
                socket.off('task-updated');
                socket.off('task-comment-added');
            }
        };
    }, [task, socket, id]);

    const fetchTask = async () => {
        try {
            const response = await tasksAPI.getById(id);
            setTask(response.data.data);
            setFormData({
                title: response.data.data.title,
                description: response.data.data.description,
                status: response.data.data.status,
                priority: response.data.data.priority,
                assignedTo: response.data.data.assignedTo?._id || ''
            });
        } catch (error) {
            console.error('Error fetching task:', error);
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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await tasksAPI.update(id, formData);
            setShowEditModal(false);
            fetchTask();
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        try {
            await tasksAPI.addComment(id, commentText);
            setShowCommentModal(false);
            setCommentText('');
            fetchTask();
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await tasksAPI.delete(id);
                window.location.href = '/tasks';
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task');
            }
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!task) {
        return <div className="text-center">Task not found</div>;
    }

    return (
        <div className="task-detail">
            <div className="task-header">
                <div>
                    <Link to="/tasks" className="back-link">← Back to Tasks</Link>
                    <h1>{task.title}</h1>
                    <div className="task-badges">
                        <span className={`badge badge-${task.status}`}>{task.status}</span>
                        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    </div>
                </div>
                <div className="task-actions">
                    <button className="btn btn-outline" onClick={() => setShowEditModal(true)}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>

            <div className="task-content">
                <div className="card">
                    <h3>Description</h3>
                    <p>{task.description || 'No description'}</p>
                </div>

                <div className="task-info-grid">
                    <div className="card">
                        <h3>Project</h3>
                        <Link to={`/projects/${task.project?._id}`}>{task.project?.name || 'No project'}</Link>
                    </div>
                    <div className="card">
                        <h3>Assigned To</h3>
                        <p>{task.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                    <div className="card">
                        <h3>Created By</h3>
                        <p>{task.createdBy?.name || 'Unknown'}</p>
                    </div>
                    {task.dueDate && (
                        <div className="card">
                            <h3>Due Date</h3>
                            <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>Comments</h3>
                        <button className="btn btn-primary" onClick={() => setShowCommentModal(true)}>
                            + Add Comment
                        </button>
                    </div>
                    {task.comments && task.comments.length > 0 ? (
                        <div className="comments-list">
                            {task.comments.map((comment, index) => (
                                <div key={index} className="comment-item">
                                    <div className="comment-header">
                                        <strong>{comment.user?.name || 'Unknown'}</strong>
                                        <span className="comment-date">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No comments yet</p>
                    )}
                </div>
            </div>

            {showEditModal && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Task</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
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
                                    value={formData.assignedTo}
                                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCommentModal && (
                <div className="modal-overlay" onClick={() => setShowCommentModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Comment</h2>
                        <form onSubmit={handleAddComment}>
                            <div className="form-group">
                                <label className="form-label">Comment</label>
                                <textarea
                                    className="form-textarea"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowCommentModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">Add Comment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetail;

