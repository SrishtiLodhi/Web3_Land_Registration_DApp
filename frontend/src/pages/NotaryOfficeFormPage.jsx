import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import PageLayout from './PageLayout';
import NotaryOfficeForm from '../components/NotaryOfficeForm';

const NotaryOfficeFormPage = (isLoggedIn) => {
    return (
        <PageLayout>
            <Container component="main" sx={{ mt: 8, mb: 2 }}>
                <NotaryOfficeForm isLoggedIn={isLoggedIn} />
            </Container>
        </PageLayout>
    );
};

export default NotaryOfficeFormPage;
