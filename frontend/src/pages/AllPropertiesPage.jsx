import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import PageLayout from './PageLayout';
import { useNavigate } from 'react-router-dom';
import { getAllProperties } from '../components/backendConnectors/landConnector';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../components/AuthContext';



const PropertyCard = ({ property }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        // Redirect to the property details page with property details as state
        navigate(`/propertyDetails/${property.unique_id}`, { state: { property } });
    };

    return (
        <Card sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    {property.name}
                </Typography>
                <Button variant="outlined" style={{ backgroundColor: "#008080", color: "#ffffff" }} onClick={handleViewDetails}>
                    View Details
                </Button>
            </CardContent>
        </Card>
    );
};

const AllPropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const { onLogin, isLoggedIn, onLogout } = useAuth();

    useEffect(() => {
        // Load properties when the component mounts
        loadProperties();
    }, []);

    const loadProperties = async () => {
        const result = await getAllProperties();

        if (result.success) {
            setProperties(result.properties);
        } else {
            console.error(result.msg);
        }
    };

    return (
        <PageLayout>
            {isLoggedIn ? (<Container component="main" sx={{ mt: 8, mb: 2 }}>
                <Typography variant="h4" component="div" gutterBottom>
                    All Properties
                </Typography>
                {properties.map((property) => (
                    <PropertyCard key={property.unique_id} property={property} />
                ))}
            </Container>) : ((<Typography variant="h6" align="center" gutterBottom>
                You need to be logged in to view properties.
            </Typography>))}

        </PageLayout>
    );
};

export default AllPropertiesPage;
