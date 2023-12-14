import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Alert, Box, CircularProgress, Snackbar
} from '@mui/material';
import { useAuth } from './AuthContext';

import { addSRO } from './backendConnectors/landConnector';

const SROOfficeForm = () => {
    const { onLogin, isLoggedIn, onLogout } = useAuth();
    const [formData, setFormData] = useState({
        district_id: '',
        address: '',
    });


    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(true);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');



    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const onSubmit = async (event) => {
        event.preventDefault();



        try {
            setLoading(true);
            const result = await addSRO(formData);
            if (result.success) {
                setSnackbarSeverity('success');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
            }

        } catch (error) {
            setLoading(false);
            console.error('Error handling makeLandAvailable:', error.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('An unexpected error occurred.');
            setSnackbarOpen(true);

        }
        setLoading(false);
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    return (
        <Container component="main" maxWidth="xs">
            {isLoggedIn ? (<form onSubmit={onSubmit} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Register SRO Office
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="district_id"
                            label="District ID"
                            name="district_id"
                            value={formData.district_id}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="address"
                            label="Office Address"
                            name="address"
                            value={formData.address}
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
                            Add SRO Office
                        </Button>
                    </Grid>
                </Grid>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert severity={snackbarSeverity} onClose={handleSnackbarClose}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>



                {loading && (
                    <Box
                        sx={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
            </form>) : (<Typography variant="h6" align="center" gutterBottom>
                You need to be logged in to add a SRO office address.
            </Typography>)}

        </Container>
    );
};

export default SROOfficeForm;
