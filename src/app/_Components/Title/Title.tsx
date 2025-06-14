"use client"
import { store } from '@/lib/redux/reduxStore';
import { Box, Grid, InputAdornment, styled, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import staticImage from '@images/user.jpg';
import axios from 'axios';
import cookie from "js-cookie";
import { getUserData } from '@/lib/redux/authSlice';
import { toast } from "react-toastify";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManIcon from '@mui/icons-material/Man';
import GirlIcon from '@mui/icons-material/Girl';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


export default function Title() {

    const {userData} = useSelector((state: ReturnType<typeof store.getState>) => state.authSlice);

    const dispatch = useDispatch<typeof store.dispatch>();

    // Get upload profile photo
    async function handleUploadProfile(file: File | null | undefined){
        if (file) {
            const payload = new FormData();
            payload.append("photo", file);

            try{
                const {data} = await axios.put(`${process.env.baseUrl}${process.env.baseUrl}/users/upload-photo`,payload,{
                    headers:{
                        token: cookie.get("userTokenSocialApp")!,
                    }
                });
                // console.log("dataHandleUploadProfile",data);
                dispatch(getUserData());
                toast.success("Profile photo updated successfully! 🖼️✅");

                return data;
            }
            catch{
                // console.log("errorHandleUploadProfile",error);
                toast.error("Failed to upload profile photo. Please try again 😓");
            }
        }
    };

    // change password
    // async function changePassword(){

    //     try{
    //         const {data} = await axios.put("https://linked-posts.routemisr.com/users/change-password",{
    //             headers:{
    //                 token: cookie.get("userTokenSocialApp")!,
    //             },
    //         });
    //         // console.log("dataHandleUploadProfile",data);
    //         dispatch(getUserData());
    //         toast.success("Image updated successfully");

    //         return data;
    //     }
    //     catch(error) {
    //         console.log("errorHandleUploadProfile",error);
    //         // toast.success("An error occurred while loading the image.");
    //     }
    // };

    return <>
        <Box>
            <Grid container spacing={2} sx={{ display:"flex", justifyContent:"center",}}>

                <Grid size={1}>
                    
                </Grid>

                <Grid size={10} sx={{ display:"flex", flexDirection:"column", gap:"10px", width:"100%", padding:"20px", fontFamily:"var(--font-fira)"}}>
                    <Box sx={{textAlign:"center"}}>
                        <label htmlFor="profileUpload">
                            <Image width={100} height={100} src={userData?.photo || staticImage} style={{boxShadow:"0 0.5rem 1rem #00000026", border:"1px solid #dee2e6", borderRadius:"50%", padding:"10px", cursor:"pointer"}} alt={userData?.name || "ProfileImage"} />

                            <VisuallyHiddenInput
                                id="profileUpload"
                                type="file"
                                onChange={(event) => handleUploadProfile(event.target.files?.[0]) }
                                />
                        </label>

                    </Box>
                    <Typography component="h3" sx={{textAlign:"center", fontSize:"30px"}}>{userData?.name}</Typography>
                    <Typography component="h4" sx={{ pt:"40px", fontSize:"30px"}}>Account Details</Typography>

                    <Box component="form" sx={{borderRadius:"10px", border:"1px solid #ccc", boxShadow:"0 0.5rem 1rem #00000026", display:"flex", flexDirection:"column", alignItems:"center", gap:"20px", padding:"30px"}}>
                        <TextField
                            fullWidth
                            disabled
                            id="outlined-disabled"
                            defaultValue={userData?.name}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                                )
                            }}/>
                        <TextField
                            fullWidth
                            disabled
                            id="outlined-disabled"
                            defaultValue={userData?.email}
                            InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                    )
                                }}/>
                        <TextField
                            fullWidth
                            disabled
                            id="outlined-disabled"
                            defaultValue={userData?.dateOfBirth}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <CalendarMonthIcon />
                                </InputAdornment>
                                )
                            }}/>
                        <TextField
                            fullWidth
                            disabled
                            id="outlined-disabled"
                            defaultValue={userData?.gender}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    {userData?.gender == "male" ? <ManIcon /> : <GirlIcon /> }
                                </InputAdornment>
                                )
                            }}/>

                    </Box>
                </Grid>

                <Grid size={1}>
                    
                </Grid>
            </Grid>
        </Box>
    </>
}
