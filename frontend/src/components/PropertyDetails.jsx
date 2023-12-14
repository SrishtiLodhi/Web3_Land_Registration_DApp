import React, { useState, useEffect } from 'react';
import {
    Typography,
    Divider,
    Paper,
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    TextField, CircularProgress
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import PageLayout from '../pages/PageLayout';
import { Snackbar, Alert } from '@mui/material';

import { makeLandAvailable, createRequest, fetchRequestDetails, acceptRequest, rejectRequest, payAllFeesAndBuyProperty } from './backendConnectors/landConnector';
import { ethers } from 'ethers';
import CreateRequestModal from './CreateRequestModal';
import { useAuth } from './AuthContext';

const LAND_STATUS = {
    NOT_FOR_SALE: 0,
    FOR_SALE: 1,
    ACCEPTED: 2,
};



const PropertyDetails = () => {
    const location = useLocation();
    const { state } = location || {};
    const { onLogin, isLoggedIn, onLogout } = useAuth();
    const [dummyRequests, setDummyRequests] = useState([
        { requester: 'User1', amount: 100 },
        { requester: 'User2', amount: 150 },
    ]);
    const [activeStep, setActiveStep] = useState(0);

    const [snackbarOpen, setSnackbarOpen] = useState(true);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [price, setPrice] = useState('');
    const [isBuyer, setIsBuyer] = useState(false);

    // for crete reqeust 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requesterName, setRequesterName] = useState('');
    const [requestPrice, setRequestPrice] = useState('');

    const [loading, setLoading] = useState(false);

    // request 
    const [requests, setRequests] = useState([]);

    const [property, setProperty] = useState(state?.property);

    const handleCreateRequest = () => {

        setIsModalOpen(true);
    };

    const handleCloseModal = () => {

        setIsModalOpen(false);
    };


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {

                const result = await fetchRequestDetails(String(parseInt(property[0]._hex, 16)));

                console.log({ result })

                if (result.success) {
                    // Update requests state with the fetched data
                    setRequests(result.properties);
                } else {
                    console.error('Error fetching request details:', result.msg);
                }
            } catch (error) {
                console.error('Error fetching request details:', error.message);
            }
        };

        // Fetch data initially
        fetchData();

        // Setup interval to fetch data every 4 seconds
        const intervalId = setInterval(fetchData, 4000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchRequestDetails(String(parseInt(property[0]._hex, 16)));

                if (result.success) {
                    setRequests(result.properties);
                } else {
                    console.error('Error fetching request details:', result.msg);
                }
            } catch (error) {
                console.error('Error fetching request details:', error.message);
            }
        };

        const checkWalletOwner = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

                    if (accounts.length > 0) {
                        const currentWalletAddress = accounts[0];
                        const isCurrentWalletOwner = currentWalletAddress.toLowerCase() === property[2].toLowerCase();

                        setIsBuyer(!isCurrentWalletOwner);
                    }

                    window.ethereum.on('accountsChanged', (accounts) => {
                        if (accounts.length > 0) {
                            const currentWalletAddress = accounts[0];
                            const isCurrentWalletOwner = currentWalletAddress.toLowerCase() === property[2].toLowerCase();

                            setIsBuyer(!isCurrentWalletOwner);
                        }
                    });
                } catch (error) {
                    console.error('Error checking wallet owner:', error.message);
                }
            }
        };

        // Fetch data initially
        fetchData();

        // Setup interval to fetch data every 4 seconds
        const intervalId = setInterval(fetchData, 4000);

        // Check wallet owner on component mount
        checkWalletOwner();

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [property]);




    if (!state || !state.property) {
        return (
            <PageLayout>
                <Paper
                    elevation={3}
                    sx={{
                        maxWidth: 600,
                        margin: 'auto',
                        textAlign: 'center',
                        padding: 3,
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Property Details
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" paragraph>
                        No property details available.
                    </Typography>
                </Paper>
            </PageLayout>
        );
    }






    const handleMakeLandAvailable = async () => {
        try {
            setLoading(true);
            const scaledPrice = ethers.utils.parseUnits(price, 18);

            const result = await makeLandAvailable(String(parseInt(property[0]._hex, 16)), scaledPrice.toString());

            if (result.success) {
                setSnackbarSeverity('success');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
            }

            const updatedProperty = [...property];
            updatedProperty[7] = LAND_STATUS.FOR_SALE;
            setProperty(updatedProperty);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error handling makeLandAvailable:', error.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('An unexpected error occurred.');
            setSnackbarOpen(true);
        }
    };

    const handleAcceptRequest = async (index) => {

        try {

            setLoading(true);

            const result = await acceptRequest(parseInt(property[0]._hex, 16), index);



            if (result.success) {


                setSnackbarSeverity('success');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);


            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage(result.msg || 'An error occurred while accepting the request.');
                setSnackbarOpen(true);
            }

            setLoading(false);


        } catch (error) {
            setLoading(false);

            console.error('Error handling accept request:', error.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('An unexpected error occurred.');
            setSnackbarOpen(true);
        }

    };

    const handleRejectRequest = (index) => {
        // Logic to reject the request
        // ...
        const updatedRequests = [...dummyRequests];
        updatedRequests.splice(index, 1);
        setDummyRequests(updatedRequests);
    };

    const steps = [
        'Create Request',
        'Buy Property',
    ];


    const handleRequestSubmit = async () => {
        try {
            setIsModalOpen(false);



            const scaledPrice = ethers.utils.parseUnits(requestPrice, 18);
            setLoading(true);

            const result = await createRequest(requesterName, String(parseInt(property[0]._hex, 16)), scaledPrice.toString());


            if (result.success) {
                setLoading(false);

                setSnackbarSeverity('success');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
                setActiveStep((prevStep) => prevStep + 1);

                const updatedProperty = [...property];
                updatedProperty[7] = LAND_STATUS.ACCEPTED;
                setProperty(updatedProperty);
            } else {
                setLoading(false);


                setSnackbarSeverity('error');
                setSnackbarMessage(result.msg || 'An error occurred while creating the request.');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error handling request submission:', error.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('An unexpected error occurred.');
            setSnackbarOpen(true);
        }
    };


    const handleBuyProperty = async () => {
        try {

            setLoading(true);

            const result = await payAllFeesAndBuyProperty(parseInt(property[0]._hex, 16));


            if (result.success) {
                setSnackbarSeverity('success');
                setSnackbarMessage(result.message);
                setSnackbarOpen(true);
                setActiveStep((prevStep) => prevStep + 1);
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage(result.msg || 'An error occurred while buying property.');
                setSnackbarOpen(true);
            }
            setLoading(false);

        } catch (error) {
            setLoading(false);

            console.error('Error handling buy prop.:', error.message);
            setSnackbarSeverity('error');
            setSnackbarMessage('An unexpected error occurred.');
            setSnackbarOpen(true);
        }
    };



    function getStatusText(status) {
        switch (status) {
            case 0:
                return "Not For Sale";
            case 1:
                return "For Sale";
            case 2:
                return "Accepted";

            default:
                return "Unknown Status";
        }
    }

    const getStatusStep = () => {
        switch (property[7]) {
            case LAND_STATUS.NOT_FOR_SALE:
                return null;
            case LAND_STATUS.FOR_SALE:
                return 0; // Start from the first step
            case LAND_STATUS.ACCEPTED:
                return 1; // Start from the second step (Buy Property)
            default:
                return null;
        }
    };

    const activeStepFromStatus = getStatusStep();





    return (


        <PageLayout>

            <Box
                p={3}
                component={Paper}
                elevation={3}
                sx={{
                    maxWidth: 680,
                    margin: 'auto',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    marginTop: '40px',
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Property Details
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Unique ID:</strong> {parseInt(property[0]._hex, 16)}


                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Address of the Property:</strong> {property[1]}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Owner of the Property:</strong> {property[2]}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>District ID:</strong> {parseInt(property[3]._hex, 16)}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Price:</strong> {parseInt(property[4]._hex, 16) !== 0 ? parseInt(property[4]._hex, 16) : "No price available"}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>New Owner:</strong> {property[6] !== "0x0000000000000000000000000000000000000000" ? property[6] : "No new owner information"}
                </Typography>

                <Typography variant="body1" paragraph>
                    <strong>Status:</strong> {getStatusText(property[7])}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Size:</strong> {property[8]}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Name:</strong> {property[9]}
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>New Owner Name:</strong> {property[10] ? property[10] : "No new owner information"}
                </Typography>


                <Divider sx={{ my: 2 }} />

                {!isBuyer && (
                    <Box mt={2}>
                        <Paper
                            elevation={3}
                            sx={{
                                maxWidth: 400,
                                margin: 'auto',
                                padding: 3,
                                borderRadius: 8,
                            }}
                        >
                            <Typography variant="h5" align="center" gutterBottom>
                                Make Land Available
                            </Typography>
                            <form>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        label="Enter Price"
                                        variant="outlined"
                                        fullWidth
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        error={!price || isNaN(price)}
                                    />
                                </Box>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: "#008080", color: "#ffffff" }}
                                    onClick={handleMakeLandAvailable}
                                >
                                    Make Land Available
                                </Button>
                            </form>
                        </Paper>

                        {requests.length > 0 && (
                            <div>
                                {/* Display the fetched requests */}
                                <Typography variant="h5" gutterBottom mt={2} >
                                    Fetched Requests
                                </Typography>

                                {requests.map((request, index) => (
                                    <Paper sx={{ p: 2 }}>
                                        <Box key={index} mt={2} >
                                            <Typography variant="body1" paragraph>
                                                <strong>Requester Name:</strong> {request.requester_name}
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                <strong>Requester Address:</strong> {request.requester}
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                <strong>Amount:</strong> {request.amount.toString()}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                style={{ backgroundColor: "#008080", color: "#ffffff" }}
                                                onClick={() => handleAcceptRequest(index)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleRejectRequest(index)}
                                            >
                                                Reject
                                            </Button>
                                            {/* Add more fields as needed */}
                                        </Box>
                                    </Paper>
                                ))}


                            </div>
                        )}

                    </Box>
                )}

                {isBuyer && (activeStepFromStatus !== null &&
                    <Box mt={2}>
                        <Stepper activeStep={activeStepFromStatus} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {activeStepFromStatus === 0 && (
                            <Button
                                variant="contained"
                                style={{ backgroundColor: "#008080", color: "#ffffff" }}
                                onClick={handleCreateRequest}
                                sx={{ mt: 2 }}
                            >
                                Create Request
                            </Button>


                        )}

                        <CreateRequestModal
                            isOpen={isModalOpen}
                            onClose={handleCloseModal}
                            onRequestSubmit={handleRequestSubmit}
                            requesterName={requesterName}
                            setRequesterName={setRequesterName}
                            requestPrice={requestPrice}
                            setRequestPrice={setRequestPrice}
                        />



                        {activeStepFromStatus === 1 && (
                            <Button
                                variant="contained"
                                style={{ backgroundColor: "#008080", color: "#ffffff" }}
                                onClick={handleBuyProperty}
                                sx={{ mt: 2 }}
                            >
                                Buy Property
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

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
        </PageLayout>
    );
};

export default PropertyDetails;
