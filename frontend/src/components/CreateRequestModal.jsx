import React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from '@mui/material';

const CreateRequestModal = ({
    isOpen,
    onClose,
    onRequestSubmit,
    requesterName,
    setRequesterName,
    requestPrice,
    setRequestPrice
}) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="create-request-modal"
            aria-describedby="create-request-form"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 8
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Create Request
                </Typography>
                <form>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Request Name"
                            variant="outlined"
                            fullWidth
                            value={requesterName}
                            onChange={(e) => setRequesterName(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Request Price"
                            variant="outlined"
                            fullWidth
                            value={requestPrice}
                            onChange={(e) => setRequestPrice(e.target.value)}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#008080", color: "#ffffff" }}
                        onClick={onRequestSubmit}
                    >
                        Submit Request
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};
export default CreateRequestModal;
