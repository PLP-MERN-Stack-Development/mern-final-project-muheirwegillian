import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { teamsAPI } from '../services/api';
import './Teams.css';

const Teams = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await teamsAPI.getAll();
            setTeams(response.data.data || []);
        } catch (error) {
            console.error('Error fetching teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await teamsAPI.create(formData);
            setShowModal(false);
            setFormData({ name: '', description: '' });
            fetchTeams();
        } catch (error) {
            console.error('Error creating team:', error);
            alert('Failed to create team');
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="teams-page">
            <div className="page-header">
                <h1>Teams</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    + New Team
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Create New Team</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Team Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {teams.length === 0 ? (
                <div className="card text-center">
                    <p>No teams yet. Create your first team!</p>
                </div>
            ) : (
                <div className="teams-grid">
                    {teams.map(team => (
                        <Link key={team._id} to={`/teams/${team._id}`} className="team-card">
                            <h3>{team.name}</h3>
                            <p className="team-description">{team.description || 'No description'}</p>
                            <div className="team-meta">
                                <span>{team.members?.length || 0} members</span>
                                <span>{team.projects?.length || 0} projects</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Teams;

