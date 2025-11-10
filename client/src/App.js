import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Profile from './pages/Profile';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Router>
                    <div className="App">
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <PrivateRoute>
                                            <Dashboard />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/projects"
                                    element={
                                        <PrivateRoute>
                                            <Projects />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/projects/:id"
                                    element={
                                        <PrivateRoute>
                                            <ProjectDetail />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/tasks"
                                    element={
                                        <PrivateRoute>
                                            <Tasks />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/tasks/:id"
                                    element={
                                        <PrivateRoute>
                                            <TaskDetail />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/teams"
                                    element={
                                        <PrivateRoute>
                                            <Teams />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/teams/:id"
                                    element={
                                        <PrivateRoute>
                                            <TeamDetail />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <PrivateRoute>
                                            <Profile />
                                        </PrivateRoute>
                                    }
                                />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </main>
                    </div>
                </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;

