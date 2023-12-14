import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import PageLayout from './PageLayout';
import CreateProperty from '../components/CreateProperty';

const CreatePropertyPage = (isLoggedIn) => {
    return (
        <PageLayout>
            <Container component="main" sx={{ mt: 8, mb: 2 }}>
                <CreateProperty isLoggedIn={isLoggedIn} />
            </Container>
        </PageLayout>
    );
};

export default CreatePropertyPage;
