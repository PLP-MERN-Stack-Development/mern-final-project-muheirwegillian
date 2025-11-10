import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teamsAPI, usersAPI } from '../services/api';
import './TeamDetail.css';

const TeamDetail = () => {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [memberForm, setMemberForm] = useState({ userId: '' });

    useEffect(() => {
        fetchTeam();
        fetchUsers();
    }, [id]);

    const fetchTeam = async () => {
        try {
            const response = await teamsAPI.getById(id);
            setTeam(response.data.data);
        } catch (error) {
            console.error('Error fetching team:', error);
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

    const handleMemberSubmit = async (e) => {
        e.preventDefault();
        try {
            await teamsAPI.addMember(id, memberForm.userId);
            setShowMemberModal(false);
            setMemberForm({ userId: '' });
            fetchTeam();
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Failed to add member');
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!team) {
        return <div className="text-center">Team not found</div>;
    }

    return (
        <div className="team-detail">
            <div className="team-header">
                <div>
                    <Link to="/teams" className="back-link">← Back to Teams</Link>
                    <h1>{team.name}</h1>
                    <p className="team-description">{team.description || 'No description'}</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowMemberModal(true)}>
                    Add Member
                </button>
            </div>

            <div className="team-content">
                <div className="card">
                    <h3>Members ({team.members?.length || 0})</h3>
                    {team.members && team.members.length > 0 ? (
                        <div className="members-list">
                            {team.members.map((member, index) => (
                                <div key={index} className="member-item">
                                    <div>
                                        <strong>{member.user?.name || 'Unknown'}</strong>
                                        <span className="member-role">{member.role}</span>
                                    </div>
                                    <span className="member-email">{member.user?.email}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No members yet</p>
                    )}
                </div>

                <div className="card">
                    <h3>Projects ({team.projects?.length || 0})</h3>
                    {team.projects && team.projects.length > 0 ? (
                        <div className="projects-list">
                            {team.projects.map(project => (
                                <Link key={project._id} to={`/projects/${project._id}`} className="project-link">
                                    {project.name}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No projects yet</p>
                    )}
                </div>
            </div>

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
                                        <option key={user._id} value={user._id}>
                                            {user.name} ({user.email})
                                        </option>
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

export default TeamDetail;

