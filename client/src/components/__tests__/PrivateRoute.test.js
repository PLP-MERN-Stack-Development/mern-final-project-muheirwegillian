import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from '../PrivateRoute';
import { AuthProvider } from '../../context/AuthContext';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('PrivateRoute', () => {
    it('should render children when authenticated', () => {
        localStorageMock.getItem.mockReturnValueOnce('token').mockReturnValueOnce(JSON.stringify({ id: '1', name: 'Test' }));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <PrivateRoute>
                        <div>Protected Content</div>
                    </PrivateRoute>
                </AuthProvider>
            </BrowserRouter>
        );

        // Note: This test may need adjustment based on actual auth flow
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});

