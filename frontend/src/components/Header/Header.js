import React, { useState, useEffect } from 'react';

import { AppBar, Toolbar, Typography, Button, CircularProgress } from '@mui/material';
import Wallet from '../Wallet/Wallet';
import { checkRegistration } from '../backendConnectors/landConnector';
import Sidebar from '../Sidebar';

const Header = () => {
    const [isUserRegistered, setIsUserRegistered] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await checkRegistration();

                if (result.success) {
                    setIsUserRegistered(result.isUserRegistered);
                } else {
                    console.error(result.msg);
                    setIsUserRegistered(false); // Set to false if there's an error
                }
            } catch (error) {
                console.error('Error fetching registration status:', error);
                setIsUserRegistered(false); // Set to false in case of an error
            }
        };

        fetchData();
    }, []);


    return (
        <AppBar position="static" >
            {/* <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Land Registry App
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                <span style={{ margin: '0 10px' }}>|</span>
                <Button color="inherit" component={Link} to="/showProperty">
                    Show Property
                </Button>
                <span style={{ margin: '0 10px' }}>|</span>
                <Button color="inherit" component={Link} to="/createProperty">
                    Create Property
                </Button>
                <span style={{ margin: '0 10px' }}>|</span>


                {isUserRegistered === null ? ( // Loading state
                    <CircularProgress size={24} color="inherit" />
                ) : isUserRegistered ? ( // User is registered
                    <Wallet />
                ) : (
                    <Button
                        color="inherit"
                        component={Link}
                        to="/registerYourself"
                        sx={{ color: 'red', fontWeight: 'bold' }}
                    >
                        Register Yourself
                    </Button>
                )}
            </Toolbar> */}
            <Sidebar />
        </AppBar>
    );
};

export default Header;
