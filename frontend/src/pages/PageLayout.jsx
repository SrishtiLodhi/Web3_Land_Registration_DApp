import React from 'react';
import { Header, Footer } from '../components/componentIndex';
import Box from '@mui/material/Box';

const PageLayout = ({ children }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            
        >
            <Header />
            <Box component="main" flexGrow={1}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default PageLayout;
