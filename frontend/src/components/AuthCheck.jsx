// AuthCheck.js
import React, { useEffect, useState } from 'react';
import { Redirect, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { checkRegistration } from './backendConnectors/landConnector';

const AuthCheck = () => {
    const { isLoggedIn, onLogout } = useAuth(); // Remove onLogin
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [allow, setAllow] = useState(false);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const { success, _isRegistered } = await checkRegistration();

                if (success) {
                    setIsRegistered(_isRegistered);
                    console.log(setIsRegistered, "setIsRegistered")
                    // No automatic login here
                } else {
                    console.error('Authentication failed:');
                }

                setAllow(true);
            } catch (error) {
                console.error('Error during authentication:', error.message);
            } finally {
                setLoading(false);
            }
        };

        authenticateUser();
    }, [isLoggedIn, onLogout]);

    if (loading) {
        return <div>Loading...</div>;
    } else if (!isLoggedIn && isRegistered && allow) {
        // Redirect to the registration page if registered but not logged in
        navigate('/registerYourself');
        return null;
    } else if (!isLoggedIn && allow) {
        // Redirect to the login page if not logged in and not registered
        navigate('/login');
        return null;
    } else if (isLoggedIn) {
        // Redirect to the landing page if logged in
        navigate(`/landing/${true}/${true}`);
        return null;
    }

    // If none of the conditions are met, render nothing
    return { isLoggedIn, isRegistered, loading, allow };
};

export default AuthCheck;
