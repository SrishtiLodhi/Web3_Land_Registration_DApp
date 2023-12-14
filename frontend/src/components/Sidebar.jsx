import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import Wallet from './Wallet/Wallet';
import { checkRegistration } from './backendConnectors/landConnector';
import { useConnectWallet } from './Wallet/useConnectWallet';
import { useAuth } from './AuthContext';
import Person4Icon from '@mui/icons-material/Person4';
import LandscapeIcon from '@mui/icons-material/Landscape';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GroupIcon from '@mui/icons-material/Group';
import Person3Icon from '@mui/icons-material/Person3';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocationCityIcon from '@mui/icons-material/LocationCity';



const drawerWidth = 300;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
                ...openedMixin(theme),
                fontWeight: 'bold', // Adjust font weight
                fontSize: '1rem', // Adjust font size
            },
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': {
                ...closedMixin(theme),
                fontWeight: 'bold', // Adjust font weight
                fontSize: '1rem', // Adjust font size
            },
        }),
    }),
);


export default function Sidebar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { account, requestAccount, disconnectWallet, connectStatus } = useConnectWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { onLogin, isLoggedIn, onLogout } = useAuth();



    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };



    const handleConnectWallet = async () => {

        setIsLoading(true);
        setErrorMsg('');

        if (connectStatus === 'connected') {
            // Disconnect logic
            try {
                await disconnectWallet(); // Replace with your actual disconnect logic
            } catch (error) {
                setErrorMsg(error.message);
            }
        } else {
            // Connect logic
            if (!account) {
                // User is not registered, show a message to connect
                // setErrorMsg('Please register to connect your wallet.');
            } else {
                const result = await requestAccount();

                if (!result.success) {
                    setErrorMsg(result.msg);
                }
            }
        }

        setIsLoading(false);
    };



    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} style={{ backgroundColor: "#008080", color: "#ffffff" }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,

                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Land Registry App
                    </Typography>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        <Wallet />
                        {isLoggedIn ? (
                            <Button variant="contained" color="secondary" onClick={onLogout} style={{ marginLeft: '10px' }}>
                                Logout
                            </Button>
                        ) : (
                            <Typography variant="body2" sx={{ marginLeft: '8px', fontSize: '1rem' }}>
                            Please Login
                        </Typography>
    )}
                    </div>

                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider sx={{
                    marginTop: 2,


                }} />
               {isLoggedIn && (  <List>
                
                    <ListItem>
                        <ListItemIcon>
                            <Person4Icon />
                        </ListItemIcon>
                        <ListItemText primary="Manager Menu" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.4rem' }} />

                    </ListItem>
                
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                < LocationCityIcon />
                            </ListItemIcon>
                            <ListItemText primary="Land Offices" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem' }} />
                        </ListItem>
                        <ListItemButton component={Link} to="/notaryOfficeForm">
                            <ListItemIcon>
                                <SummarizeIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Add Notary"
                                primaryTypographyProps={{ noWrap: true, fontSize: 'inherit' }}
                            />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/sroOfficeFrom">
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Add SRO"
                                primaryTypographyProps={{ noWrap: true, fontSize: 'inherit' }}
                            />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/landRevenueOffice">
                            <ListItemIcon>
                                <MeetingRoomIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Add Land Revenue Office"
                            />
                        </ListItemButton>
                    </List>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <LandscapeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Land Records" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem' }} />
                        </ListItem>
                        <ListItemButton component={Link} to="/createProperty">
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Create Land Record"
                                primaryTypographyProps={{ noWrap: true, fontSize: 'inherit' }}
                            />
                        </ListItemButton>
                    </List>
                </List>
               )}
                <Divider />
                {/* User Menu */}
                <List>
                {isLoggedIn && (   <ListItem>
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary="User Menu"
                            primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.4rem' }}
                        />
                    </ListItem>
                    )}
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <AccountBalanceWalletIcon />
                            </ListItemIcon>
                            <ListItemText primary="Account" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem' }} />
                        </ListItem>
                        <ListItemButton component={Link} to="/registerYourself">
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Register User"
                                primaryTypographyProps={{ noWrap: true, fontSize: 'inherit' }}
                            />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/login">
                            <ListItemIcon>
                                <AssignmentIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Login"
                                primaryTypographyProps={{ noWrap: true, fontSize: 'inherit' }}
                            />
                        </ListItemButton>
                    </List>



                    {isLoggedIn && (   <List>
    {/* Conditionally render based on whether the user is not logged in */}
   
        <ListItem>
            <ListItemIcon>
                <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Property Information" primaryTypographyProps={{ fontWeight: 'bold', fontSize: '1.2rem' }} />
        </ListItem>
    
    {/* Always render if the user is logged in */}
    <ListItemButton component={Link} to="/showProperty">
        <ListItemIcon>
            <ReceiptIcon />
        </ListItemIcon>
        <ListItemText
            primary="Check All Properties"
            primaryTypographyProps={{ noWrap: true, fontSize: 'inherit' }}
        />
    </ListItemButton>
</List>
)}

                </List>

                <Divider />
                {/* General Menu */}

            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Typography paragraph>
                    {/* Your main content goes here */}
                </Typography>
            </Box>
        </Box>
    );
}
