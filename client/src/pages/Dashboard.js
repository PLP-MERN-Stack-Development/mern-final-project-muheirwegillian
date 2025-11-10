import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, tasksAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        tasks: 0,
        completedTasks: 0,
        activeProjects: 0
    });
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [projectsRes, tasksRes] = await Promise.all([
                projectsAPI.getAll(),
                tasksAPI.getAll()
            ]);

            const projects = projectsRes.data.data || [];
            const tasks = tasksRes.data.data || [];

            setStats({
                projects: projects.length,
                tasks: tasks.length,
                completedTasks: tasks.filter(t => t.status === 'done').length,
                activeProjects: projects.filter(p => p.status === 'active').length
            });

            setRecentProjects(projects.slice(0, 5));
            setRecentTasks(tasks.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Projects</h3>
                    <p className="stat-number">{stats.projects}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <p className="stat-number">{stats.tasks}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed Tasks</h3>
                    <p className="stat-number">{stats.completedTasks}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Projects</h3>
                    <p className="stat-number">{stats.activeProjects}</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Projects</h2>
                        <Link to="/projects" className="btn btn-outline">View All</Link>
                    </div>
                    {recentProjects.length === 0 ? (
                        <p className="text-center">No projects yet</p>
                    ) : (
                        <ul className="list">
                            {recentProjects.map(project => (
                                <li key={project._id} className="list-item">
                                    <Link to={`/projects/${project._id}`} className="list-link">
                                        <div>
                                            <strong>{project.name}</strong>
                                            <span className={`badge badge-${project.status}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Tasks</h2>
                        <Link to="/tasks" className="btn btn-outline">View All</Link>
                    </div>
                    {recentTasks.length === 0 ? (
                        <p className="text-center">No tasks yet</p>
                    ) : (
                        <ul className="list">
                            {recentTasks.map(task => (
                                <li key={task._id} className="list-item">
                                    <Link to={`/tasks/${task._id}`} className="list-link">
                                        <div>
                                            <strong>{task.title}</strong>
                                            <span className={`badge badge-${task.status}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

