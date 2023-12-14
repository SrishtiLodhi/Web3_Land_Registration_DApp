import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import PageLayout from './PageLayout';
import SROOfficeForm from '../components/SROOfficeForm';

const SROOfficeFormPage = (isLoggedIn) => {
    return (
        <PageLayout>
            <Container component="main" sx={{ mt: 8, mb: 2 }}>
                <SROOfficeForm isLoggedIn={isLoggedIn} />
            </Container>
        </PageLayout>
    );
};

export default SROOfficeFormPage;
