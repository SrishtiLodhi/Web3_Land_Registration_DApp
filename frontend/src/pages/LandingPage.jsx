import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import PageLayout from './PageLayout';
import { getPropertyDetails } from '../components/backendConnectors/landConnector';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import CreatePropertyPage from './CreatePropertyPage';

import useAuthStatus from '../components/AuthCheck';
import { useAuth } from '../components/AuthContext';

const LandingPage = () => {

    const { onLogin, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { isRegistered, isLogged } = useParams();
    const isRegisteredBoolean = isRegistered === 'true';
    const isLoggedBoolean = isLogged === 'true';
    // console.log('Is Registered bool:', isRegisteredBoolean)
    // console.log('Is isLoggedBoolean bool:', isLoggedBoolean)

    // const handleRegister = (status) => {
    //     setIsRegistered(status);
    //   };

    const handleGetStartedClick = () => {
        if (isLoggedBoolean && isRegisteredBoolean) {
            // If the user is logged in and not registered, redirect to createProperty
            navigate(`/createProperty`);
            console.log("Redirect to /createProperty");
            console.log(isLoggedBoolean, "isLoggedIn");
            console.log(isRegisteredBoolean, "isRegistered");
            return <Link to="/createProperty" />;
            
        } else if (!isRegisteredBoolean) {
            // If the user is not logged in or registered, redirect to registerYourself
            navigate('/registerYourself');
            console.log("Redirect to /registerYourself");
            console.log(isRegisteredBoolean, "isRegistered");
            return <Link to="/registerYourself" />;
            
        } else {
            // If the user is logged in and registered, redirect to login
            navigate('/login');
            console.log(isLoggedBoolean, "isLoggedBoolean");
            return <Link to="/login" />;
        }
    };
    

    const [propertyDetails, setPropertyDetails] = useState({
        forSalePropertiesCount: 0,
        userOwnedPropertiesCount: 0,
        userPendingRequestsCount: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            const result = await getPropertyDetails();

            if (result.success) {
                // Update the state with the fetched data
                setPropertyDetails({
                    forSalePropertiesCount: result.propertiesForSaleCount.toString(),
                    userOwnedPropertiesCount: result.ownedPropertiesCount.toString(),
                    userPendingRequestsCount: result.pendingRequestsCount.toString(),
                });
            } else {
                // Handle error
                console.error(result.msg);
            }
        };

        fetchData(); // Fetch data when the component mounts
    }, []); // Empty dependency array to run the effect only once

    return (
        <PageLayout>
            <Container component="main" sx={{ mt: 8, mb: 2 }}>
                <Typography variant="h2" component="div" gutterBottom>
                    Welcome to the Land Registry App
                </Typography>
                <Typography variant="h5" component="div" paragraph>
                    Your trusted platform for managing land records efficiently and securely.
                </Typography>
                <div>
                    <Typography variant="h6" component="div" gutterBottom>
                        Properties For Sale: {propertyDetails.forSalePropertiesCount}
                    </Typography>

                    <Typography variant="h6" component="div" gutterBottom>
                        Your Owned Properties: {propertyDetails.userOwnedPropertiesCount}
                    </Typography>

                    <Typography variant="h6" component="div" gutterBottom>
                        Pending Requests: {propertyDetails.userPendingRequestsCount}
                    </Typography>
                </div>
                <Button variant="contained" style={{ backgroundColor: "#008080", color: "#ffffff" }} onClick={handleGetStartedClick}>
                    Get Started
                </Button>
            </Container>
        </PageLayout>
    );
};

export default LandingPage;
