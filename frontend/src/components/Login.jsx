// Login.js
import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Alert,
    Box,
} from '@mui/material';
import { login } from './backendConnectors/landConnector';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


const Login = () => {
    const { onLogin, isLoggedIn } = useAuth();
    const [isLogged, setIsLogged] = useState(false);
    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Added successMessage state
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const result = await login(formData.username, formData.password);

            if (result.success) {
                // Successful login
                onLogin(true); // Call onLogin with true when login is successful
                setSuccessMessage('Login successful. Redirecting...');
                setIsLogged(true);
                navigate(`/landing-page/true/true`);
                // Delay the redirect for 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                // Login failed
                setErrorMessage('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('An error occurred during login. Please try again.');
        }

        setLoading(false);
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                }}
            >
                <form onSubmit={onSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                style={{ backgroundColor: "#008080", color: "#ffffff" }}
                                disabled={loading}
                            >
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                    {errorMessage && (
                        <Grid item xs={12} mt={2}>
                            <Alert severity="error">{errorMessage}</Alert>
                        </Grid>
                    )}
                    {successMessage && (
                        <Grid item xs={12} mt={2}>
                            <Alert severity="success">{successMessage}</Alert>
                        </Grid>
                    )}
                </form>
            </Box>
        </Container>
    );
};

export default Login;
