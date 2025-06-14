"use client";
import { Avatar, Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { store } from "@/lib/redux/reduxStore";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "@/lib/redux/authSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Upload from "../Upload/Upload";
import Loading from "@/app/loading";



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {xs:350, sm:500},
    bgcolor: 'background.paper',
    border: '1px solid #ddd',
    borderRadius:"20px",
    boxShadow: 24,
    px: 3,
    py: 4,
};


export default function PostCreation() {

    const {userData} = useSelector((state: ReturnType<typeof store.getState>) => state.authSlice);

    const dispatch = useDispatch<typeof store.dispatch>();

    const inputRef = useRef<HTMLInputElement>(null);
    const captionInput = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        inputRef.current?.blur();
    };

    const handleClose = () => setOpen(false);

    const router = useRouter();

    async function createPost(){
        const payload = new FormData();
        // payload.append("body", captionInput.current?.value);
        // payload.append("image", imageInputRef.current?.files[0]);

        if (captionInput.current?.value) {
            payload.append("body", captionInput.current.value);
        }
        if (imageInputRef.current?.files?.[0]) {
            payload.append("image", imageInputRef.current.files?.[0]);
        }

        await axios.post(`${process.env.baseUrl}/posts`,payload,{
            headers:{
                token: cookie.get("userTokenSocialApp")!,
            }
        }).then(()=> {
            toast.success("Post added successfully! 🎉");
            // router.push("/");
            router.refresh();
            handleClose();
        }).catch(()=> {
            toast.error("Something went wrong while adding the post. Please try again 😢");
        });

        // console.log(data);
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(()=> {
        setIsClient(true);
        dispatch(getUserData());
    },[dispatch]);


    if (!isClient) return <Loading />;


    return <>
    <Box component="section" sx={{bgcolor:"#fff", border:"1px solid #ccc", p:"20px", mt:"50px", borderRadius:"20px"}}>

        <Box sx={{display:"flex", justifyContent:"center", alignItems:"center", gap:"10px"}}>

            {userData?.photo ? (
                <Avatar src={userData.photo} alt={userData.name} style={{ borderRadius: "50%" }} />
                ) : (
                <Avatar>{userData?.name?.[0] || "U"}</Avatar>
            )}
            <TextField inputRef={inputRef} onFocus={handleOpen} sx={{mb:"10px", bgcolor:"#dddddd52"}} fullWidth multiline placeholder={`What's On Your Mind, ${userData?.name} ?`} />
        </Box>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>

                <Box>
                    <Typography variant="h5" sx={{textAlign:"center", borderBottom:"1px solid #ccc", width:"100%", pb:"10px", mb:"20px"}}>Create Post</Typography>
                </Box>
                <TextField inputRef={captionInput} sx={{mb:"10px", bgcolor:"#dddddd52"}} fullWidth multiline placeholder="What's On Your Mind ?" />
                <Upload imageInputRef={imageInputRef} />
                <Box sx={{textAlign:"center", width:"100%", my:"20px"}}>
                    <Button onClick={createPost} variant="contained" sx={{width:"100%"}} >Add Post</Button>
                </Box>
            </Box>
        </Modal>
    </Box>
    </>
}