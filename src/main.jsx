import {createContext, useContext, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Navigate, Outlet, Route, Routes} from 'react-router-dom';

import App from './App.jsx';
import AuthScreen from './components/auth/AuthScreen.jsx';
import PasswordReset from './components/auth/PasswordReset.jsx';
import ChangePassword from './components/auth/ChangePassword.jsx';

import './index.css';
import Callback from "./components/auth/Callback.jsx";
import ResetPasswordConfirmation from "./components/auth/ResetPasswordConfirmation.jsx";
import {ReactNotifications} from "react-notifications-component";

const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access'));
    const authProviderValue = {isAuthenticated, setIsAuthenticated};

    return (
        <AuthContext.Provider value={authProviderValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);

const PrivateRoute = ({children}) => {
    const {isAuthenticated, setIsAuthenticated} = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/"/>;
    }
    return children;
};

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ReactNotifications />
        <AuthProvider>
            <Routes>
                <Route path="/" element={<AuthScreen/>}/>
                <Route path="/login/callback" element={<Callback/>}/>
                <Route path="/reset-confirmation" element={<ResetPasswordConfirmation/>}/>
                <Route
                    path="/home"
                    element={<PrivateRoute><App/></PrivateRoute>}
                />
                <Route
                    path="/change"
                    element={<PrivateRoute><ChangePassword/></PrivateRoute>}
                />
                <Route path="/reset" element={<PasswordReset/>}/>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
);
