"use client"
import {AppBar, Box, Toolbar, IconButton, Typography, MenuItem, Menu} from '@mui/material';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Image from 'next/image';
import Link from 'next/link';
import profileImage from '../../../assets/images/linkUp-logo.png';
import LoginIcon from '@mui/icons-material/Login';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { useEffect, useState } from 'react';
import SearchComponent from '../SearchComponent/SearchComponent';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '@/lib/redux/reduxStore';
import { toast } from 'react-toastify';
import { clearUserData, getUserData } from '@/lib/redux/authSlice';
import { useRouter } from 'next/navigation';
import cookies from 'js-cookie';
import { setUserToken } from '@/lib/redux/authSlice';



/*
    :ملاحظة صغيرة
        :لازم تتستورد كل واحدة لوحدها، لأنها مش بتطلع من نفس الموديول العام، كل واحدة من ( SearchIcon, MenuIcon...) الأيقونات زي
            *@mui/icons-material/اسم_الأيقونة
 */

const settings = [
    {path:"/login", name:"Login", icon: <LoginIcon />},
    {path:"/register", name:"Signup", icon: <LockOpenIcon />},
    {path:"/profile", name:"Profile", icon: <PersonIcon />},
];

export default function Navbar() {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const {userData,token} = useSelector((state: ReturnType<typeof store.getState>) => state.authSlice);

    const dispatch = useDispatch<typeof store.dispatch>();
    const router = useRouter();


    function handleLogout (){
        dispatch(clearUserData());
        toast.success("You have successfully logged out. 👋");
        router.refresh();
        router.push("/login");
    }


    useEffect(()=> {
        const userToken = cookies.get("userTokenSocialApp");
        if (userToken) {
        dispatch(setUserToken(userToken));
        dispatch(getUserData());
    }
    },[dispatch]);


    return (
        <AppBar position="fixed" elevation={5}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        href="/"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}>
                        <Image src={profileImage} width={150} height={50} alt='Profile Logo' priority />
                    </Typography>

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }} >
                        <Image src={profileImage} width={150} height={50} alt='Profile Logo' />
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <SearchComponent />
                    </Box>

                    <Box sx={{ flexGrow: 0, display:"flex", alignItems:"center"}}>
                        <Typography component="h5" sx={{fontWeight:"bold", paddingRight:"10px"}}>
                            { token ? userData?.name : "" }
                        </Typography>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar src={token ? userData?.photo : ""} alt={userData?.name} />
                            </IconButton>
                        </Tooltip>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}>
                                {settings
                                    .filter(setting => {
                                        if (!token) {
                                            return setting.path === "/login" || setting.path === "/register";
                                        }
                                        else {
                                            return setting.path === "/profile";
                                        }
                                    })
                                    .map((setting) => (
                                        <MenuItem key={setting.path} onClick={handleCloseUserMenu} sx={{display:"flex", justifyContent:"space-between", alignItems:"unset", fontSize:"10px", bgcolor:"#dddddd5e", borderBottom:"1px solid #ddd"}}>
                                            <Typography component="h6">{setting.icon}</Typography>
                                            <Typography component={Link} href={setting.path} sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                                        </MenuItem>
                                    ))}

                            {token && (
                                <MenuItem onClick={handleCloseUserMenu}>
                                <Typography onClick={handleLogout} component="span" sx={{ textAlign: 'center', display:"flex", justifyContent:"space-between", alignItems:"unset", }}>
                                    <LockIcon />
                                    LogOut
                                </Typography>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

