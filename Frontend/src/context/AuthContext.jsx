import { useContext, createContext, useState, useEffect } from "react";

import { login, verifyEmail, getOtp, refreshToken, getMe } from "../api/AuthApi";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const RefreshToken = async () => {
        try {
            const response = await refreshToken();
            setUser(response.User);
            setIsAuthenticated(response.User.isEmailVerified);
            setError(null);
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const Login = async (formData) => {
        try {
            await login(formData);
            await RefreshToken();
            setError(null);
        } catch (err) {
            setError(err);
            throw err; // let the login form show a message
        }
    };

    const VerifyEmail = async (formData) => {
        try {
            await verifyEmail(formData);
            await RefreshToken();
            setError(null);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const GetOtp = async (formData) => {
        try {
            await getOtp(formData);
            setError(null);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    const GetMe = async () => {
        try {
            const response = await getMe();
            setUser(response.User);
            setError(null);
        } catch (err) {
            setError(err);
            throw err;
        }
    };

    useEffect(() => {
        RefreshToken();
    }, []);

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        Login,
        VerifyEmail,
        RefreshToken,
        GetOtp,
        GetMe,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};