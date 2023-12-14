import React, { useState, useEffect } from 'react';
import { useConnectWallet } from './useConnectWallet';
import { Button, CircularProgress, Typography, Box, Menu, MenuItem } from '@mui/material';
import { getUsername, checkRegistration } from '../backendConnectors/landConnector';
import { Link } from 'react-router-dom'; // Assuming you are using React Router

const Wallet = () => {
    const { account, requestAccount, disconnectWallet, connectStatus } = useConnectWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [username, setUsername] = useState('');
    const [isUserRegistered, setIsUserRegistered] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchUsername = async () => {
            if (account) {
                const result = await getUsername(account);

                if (result.success) {
                    setUsername(result.username);
                } else {
                    setErrorMsg(result.message);
                }
            }
        };

        fetchUsername();

        // Poll for wallet connection status every 5 seconds
        const intervalId = setInterval(() => {
            fetchUsername();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [account]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await checkRegistration();

                if (result.success) {
                    setIsUserRegistered(result.isRegisterd);
                } else {
                    console.error(result.msg);
                    setIsUserRegistered(false); // Set to false if there's an error
                }
            } catch (error) {
                console.error('Error fetching registration status:', error);
                setIsUserRegistered(false); // Set to false in case of an error
            }
        };

        // Fetch data every 2 seconds
        const fetchDataInterval = setInterval(() => {
            fetchData();
        }, 2000);

        // Initial fetch
        fetchData();

        return () => clearInterval(fetchDataInterval); // Clear interval on component unmount
    }, []);

    useEffect(() => {
        const fetchWalletStatus = async () => {
            // Check wallet connection status
            // if (account) {
            //     // The wallet is connected
            //     console.log('Wallet connected');
            // } else {
            //     // The wallet is not connected
            //     console.log('Wallet not connected');
            // }
        };

        // Fetch wallet connection status every 2 seconds
        const fetchWalletStatusInterval = setInterval(() => {
            fetchWalletStatus();
        }, 2000);

        // Initial fetch
        fetchWalletStatus();

        return () => clearInterval(fetchWalletStatusInterval); // Clear interval on component unmount
    }, [account]);


    const handleConnectWallet = async () => {
        setIsLoading(true);
        setErrorMsg('');

        if (connectStatus === 'connected') {
            // Disconnect logic
            try {
                await disconnectWallet(); // Replace with your actual disconnect logic
            } catch (error) {
                setErrorMsg(error.message);
            }
        } else {
            // Connect logic
            if (!account) {
                // User is not registered, show a message to connect
                setErrorMsg('Please register to connect your wallet.');
            } else {
                const result = await requestAccount();

                if (!result.success) {
                    setErrorMsg(result.msg);
                }
            }
        }

        setIsLoading(false);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };



    return (
        <Box display="flex" alignItems="center">
            {connectStatus === 'connected' ? (
                isUserRegistered ? (
                    <Typography variant="body2" sx={{ marginLeft: '8px', fontSize: '1rem' }}>
                        Welcome, {username}! 
                    </Typography>
                ) : (
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#008080", color: "#ffffff" }}
                        component={Link}  // Use Link component for navigation
                        to="/registerYourself"  // Specify the target URL
                        sx={{ textTransform: 'capitalize', borderRadius: '8px' }}
                    >
                        Register Yourself
                    </Button>
                )
            ) : (
                <Button
                    variant="contained"
                    style={{ backgroundColor: "#008080", color: "#ffffff" }}
                    onClick={handleMenuOpen}
                    disabled={isLoading}
                    sx={{ textTransform: 'capitalize', borderRadius: '8px' }}
                >
                    Connect Wallet
                </Button>
            )}
        </Box>
    );
};

export default Wallet;
