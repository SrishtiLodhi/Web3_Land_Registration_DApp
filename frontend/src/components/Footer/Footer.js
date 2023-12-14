import React from 'react';
import { Typography, Container } from '@mui/material';

const Footer = () => {
    return (
        <Container component="footer" maxWidth="sm" sx={{ mt: 'auto', py: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} Land Registry App. All rights reserved.
            </Typography>
        </Container>
    );
};

export default Footer;