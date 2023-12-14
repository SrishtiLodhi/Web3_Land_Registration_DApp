import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Alert,
    CircularProgress, Box, Snackbar
} from '@mui/material';

import { useParams } from 'react-router-dom';

import { createProperty } from './backendConnectors/landConnector';
import { useAuth } from './AuthContext';

const CreateProperty = () => {
    const { onLogin, isLoggedIn, onLogout } = useAuth();
    const { isLogged } = useParams();
    const isLoggededBoolean = isLogged === 'true';
    const [formData, setFormData] = useState({
        district_id: '',
        house_no: '',
        area: '',
        city: '',
        district: '',
        state: '',
        owner: '',
        owner_name: '',
        size: '',
    });

    const [snackbarOpen, setSnackbarOpen] = useState(true);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();

        setErrorMessage('');

        try {
            setLoading(true);

            const result = await createProperty(formData);

            if (result.success) {
                setSnackbarSeverity('success');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
            }



            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.error('Error handling makeLandAvailable:', error.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('An unexpected error occurred.');
            setSnackbarOpen(true);
        }

    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                            Add Property
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
                            id="house_no"
                            label="House No."
                            name="house_no"
                            value={formData.house_no}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="area"
                            label="Sector/Area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="city"
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="district"
                            label="District"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="state"
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="owner_name"
                            label="Owner Name"
                            name="owner_name"
                            value={formData.owner_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="owner"
                            label="Wallet's Address"
                            name="owner"
                            value={formData.owner}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="size"
                            label="Size in sq. ft"
                            name="size"
                            value={formData.size}
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
                            Add Property
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
            </form>

            ) : (<Typography variant="h6" align="center" gutterBottom>
                You need to be logged in to add a property.
            </Typography>)}

        </Container>
    );
};

export default CreateProperty;
