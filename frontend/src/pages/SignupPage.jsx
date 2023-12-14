import React from 'react';
import { Container } from '@mui/material';
import PageLayout from './PageLayout';
import Signup from '../components/Signup';

const SignupPage = () => {
    return (
        <PageLayout>
            <Container
                component="main"
                sx={{
                    mt: 'auto',
                    mb: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80vh',
                }}
            >
                <Signup />
            </Container>
        </PageLayout>
    );
};

export default SignupPage;
