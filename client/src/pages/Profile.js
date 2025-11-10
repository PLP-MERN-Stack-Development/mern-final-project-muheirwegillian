import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await authAPI.getMe();
            setProfile(response.data.user);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="profile-page">
            <h1>Profile</h1>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profile?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2>{profile?.name || 'User'}</h2>
                        <p className="profile-email">{profile?.email}</p>
                    </div>
                </div>
                <div className="profile-info">
                    <div className="info-item">
                        <strong>Role:</strong> {profile?.role || 'user'}
                    </div>
                    <div className="info-item">
                        <strong>Member Since:</strong>{' '}
                        {profile?.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString()
                            : 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

