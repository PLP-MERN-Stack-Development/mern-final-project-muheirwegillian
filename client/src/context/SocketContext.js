import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user, isAuthenticated } = useAuth();
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

    useEffect(() => {
        if (isAuthenticated && user) {
            const token = localStorage.getItem('token');
            const newSocket = io(SOCKET_URL, {
                auth: { token }
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [isAuthenticated, user]);

    const joinProject = (projectId) => {
        if (socket) {
            socket.emit('join-project', projectId);
        }
    };

    const leaveProject = (projectId) => {
        if (socket) {
            socket.emit('leave-project', projectId);
        }
    };

    const value = {
        socket,
        joinProject,
        leaveProject
    };

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

