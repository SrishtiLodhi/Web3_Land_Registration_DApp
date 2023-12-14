import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Paper,
    Box, CircularProgress, Snackbar
} from '@mui/material';
import { checkUsernameAvailability, registerUserOnBlockchain } from './backendConnectors/landConnector';
import { useNavigate } from 'react-router-dom';

const Signup = ({ onRegister, isLogged }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        aadhar: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(true);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        // Check if mandatory fields are filled
        if (!formData.username || !formData.password || !formData.aadhar) {
            setErrorMessage('All fields are mandatory.');
            return;
        }

        // Check if username is already taken
        const { isSuceess, isUsernameTaken } = await checkUsernameAvailability(formData.username);

        if (isSuceess && isUsernameTaken) {
            setErrorMessage('Username is already taken. Please choose another.');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            // Perform signup logic
            const result = await registerUserOnBlockchain(formData.username, formData.password, formData.aadhar);

            // if (registrationResult.success) {
            //     setErrorMessage(registrationResult.message);
            //     setOpenDialog(true);
            //     // Reset the form values
            //     setFormData({
            //         username: '',
            //         password: '',
            //     });
            // } else {
            //     setErrorMessage(registrationResult.message);
            // }

            if (result.success) {
                setSnackbarSeverity('success');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
                setIsRegistered(true);
                onRegister(true);
                navigate(`/landing/${true}/${isLogged}`);
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

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    // const handleBlur = () => {
    //     if (formData.aadhar.length !== 12) {
    //         setFormData({
    //             ...formData,
    //             aadharError: 'Aadhar card must have 12 digits',
    //         });
    //     } else {
    //         setFormData({
    //             ...formData,
    //             aadharError: '',
    //         });
    //     }
    // };

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
                <Paper elevation={3} sx={{ p: 3, maxWidth: 400, width: '100%' }}>
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
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="aadhar"
                                    label="Aadhar card"
                                    name="aadhar"
                                    type="aadhar"
                                    value={formData.aadhar}
                                    onChange={handleChange} 
                                    helperText={
                                        formData.aadhar.length !== 12
                                            ? <span style={{ color: 'red' }}>Aadhar card must have 12 digits</span>
                                            : ''
                                    }
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
                                    Signup
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
                </Paper>
            </Box>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Signup Successful</DialogTitle>
                <DialogContent>
                    <Typography>
                        Thank you for signing up!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} style={{ backgroundColor: "#008080", color: "#ffffff" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Signup;
