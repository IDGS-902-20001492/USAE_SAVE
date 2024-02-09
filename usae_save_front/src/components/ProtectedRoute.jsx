import { Navigate, Route } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
export const ProtectedRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth') === 'true';

    return (
        <Route
            {...rest}
            element={isAuthenticated ? <Element /> : <Navigate to="/login" />}
        />
    );
};
