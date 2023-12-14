import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import PageLayout from './PageLayout';
import LandRevenueOfficeForm from '../components/LandRevenueOfficeForm';

const LandRevenueOfficeFormPage = (isLoggedIn) => {
    return (
        <PageLayout>
            <Container component="main" sx={{ mt: 8, mb: 2 }}>
                <LandRevenueOfficeForm isLoggedIn={isLoggedIn} />
            </Container>
        </PageLayout>
    );
};

export default LandRevenueOfficeFormPage;
