import React from 'react';
import { Container } from '@mui/material';
import PageLayout from './PageLayout';
import Login from '../components/Login';

const LoginPage = ({ onLogin }) => {
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
                <Login onLogin={onLogin} />
            </Container>
        </PageLayout>
    );
};

export default LoginPage;
