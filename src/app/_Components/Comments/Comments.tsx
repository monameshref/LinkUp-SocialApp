"use client";
import { PostType } from "@/app/_interfacess/Post.types";
import { Avatar, Box, Button, CardContent, CardHeader, Menu, MenuItem, Modal, TextField, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import staticImage from '@images/user.jpg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useEffect, useRef, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { jwtDecode } from "jwt-decode";
import cookies from 'js-cookie';
import axios from "axios";
import cookie from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid #ddd',
    borderRadius:"20px",
    boxShadow: 24,
    px: 3,
    py: 4,
};

export default function Comments({comment,singleComment}:{comment:PostType,singleComment:boolean}) {

    const firstComment = comment.comments[0]; // أول كومنت
    // const lastComment = comment.comments[comment.comments.length -1]; // أخر كومنت

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loggedInID, setLoggedInID] = useState("");
    const token = cookies.get("userTokenSocialApp");
    const open = Boolean(anchorEl);
    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);
    const captionInput = useRef<HTMLInputElement>(null);

    const [openModal, setOpenModal] = useState(false);
    const handleCloseModal = () => setOpenModal(false);
    const handleOpenModal = () => {
    setOpenModal(true);
    inputRef.current?.blur();
};


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(()=>{
        const userData:{user:string} = jwtDecode(token!);
        setLoggedInID(userData.user);
    },[token]);


    // Updata Comment
    function handleUpdataComment(){
        // const contentData = contentElement;
        const contentData = captionInput.current?.value;
        // console.log(contentData);

        if (!contentData) {
            toast.error("Please write something before updating.");
            return;
        }

        const body = {
            content: contentData,
        }

        try {
            axios.put(`${process.env.baseUrl}/comments/${firstComment._id}`,body,{
                headers:{
                    token: cookie.get("userTokenSocialApp")!,
                }
            });
            console.log(comment._id);

            toast.success("Updata Comment...");
            router.refresh();
            handleCloseModal();
            handleClose();
        }
        catch(error){
            console.log("error" , error);
        }
    }

    function getUserImage(imgSrc: string){
            // "https://linked-posts.routemisr.com/uploads/undefined"

        if (!imgSrc) {
            return staticImage;
        }

        const pathSegments = imgSrc.split("/");
        const lastSegments = pathSegments[pathSegments.length - 1] ;

        if (lastSegments == "undefined") {
            return staticImage;
        }

        return imgSrc;
    };

    return <>
        { comment.comments.length > 0 ? <>
                { singleComment ? <>
                <Link href={`/Posts/${comment._id}`}>
                    <Typography variant='body2' 
                        sx={{px:"10px", pt:"10px", color:"#616161", fontWeight:"bold", cursor:"pointer"}}>
                            View More Comments
                    </Typography>
                </Link>

                <Box key={firstComment._id}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{background: "transparent", border: "1px solid #0000002b" }} aria-label="recipe">
                                <Image width={40} height={40} src={getUserImage(firstComment.commentCreator.photo)} alt={firstComment.commentCreator.name} />
                            </Avatar>
                        }
                        action={
                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor:"red"}}>
                                { loggedInID == firstComment.commentCreator._id ? <>
                                    <Button
                                        sx={{color:"inherit"}}
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}>
                                        <MoreHorizIcon />
                                    </Button>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                        }}>
                                        <MenuItem> <DeleteIcon /> Delete Comment </MenuItem>
                                        <MenuItem onClick={handleOpenModal}> <ModeEditIcon /> Edit Comment </MenuItem>
                                    </Menu>
                                    </> : ""}
                            </Box>
                        }

                        title={firstComment.commentCreator.name}
                        subheader={`${new Date(firstComment.createdAt).getFullYear()} / ${new Date(firstComment.createdAt).getMonth() + 1} at
                        ${new Date(firstComment.createdAt).getHours() > 12 ? new Date(firstComment.createdAt).getHours() -12 : new Date(firstComment.createdAt).getHours()}:${new Date(firstComment.createdAt).getMinutes()}:${new Date(firstComment.createdAt).getSeconds()}`}
                    />

                    <CardContent sx={{py:"0px"}}>
                        <Typography variant="body2" sx={{ color:'#212121'}}>
                            {firstComment.content}
                        </Typography>
                    </CardContent>
                </Box> </> : <>
                    { comment.comments.map((comment) => { return (
                        <Box key={comment._id}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{background: "transparent", border: "1px solid #0000002b" }} aria-label="recipe">
                                        <Image width={40} height={40} src={getUserImage(comment.commentCreator.photo)} alt={comment.commentCreator.name} />
                                    </Avatar>
                                }

                                action={
                                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor:"red"}}>
                                        { loggedInID == comment.commentCreator._id ? <>
                                            <Button
                                                sx={{color:"inherit"}}
                                                id="basic-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={handleClick}>
                                                <MoreHorizIcon />
                                            </Button>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                                }}>
                                                <MenuItem> <DeleteIcon /> Delete Comment </MenuItem>
                                                <MenuItem onClick={handleOpenModal}> <ModeEditIcon /> Edit Comment </MenuItem>
                                            </Menu>
                                            </> : ""}
                                    </Box>
                                }

                                title={comment.commentCreator.name}
                                subheader={`${new Date(comment.createdAt).getFullYear()} / ${new Date(comment.createdAt).getMonth() + 1} at
                        ${new Date(comment.createdAt).getHours() > 12 ? new Date(comment.createdAt).getHours() -12 : new Date(comment.createdAt).getHours()}:${new Date(comment.createdAt).getMinutes()}:${new Date(comment.createdAt).getSeconds()}`}
                            />

                            <CardContent sx={{py:"0px"}}>
                                <Typography variant="body2" sx={{ color:'#212121'}}>
                                    {comment.content}
                                </Typography>
                            </CardContent>
                        </Box> )
                    })} </>
                }
        </> : ""}

        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>

                <Box>
                    <Typography variant="h5" sx={{textAlign:"center", borderBottom:"1px solid #ccc", width:"100%", pb:"10px", mb:"20px"}}>Update Comment</Typography>
                </Box>
                <TextField inputRef={captionInput} sx={{mb:"10px", bgcolor:"#dddddd52"}} fullWidth multiline placeholder="Update Comment..." />
                <Box sx={{textAlign:"center", width:"100%", my:"20px"}}>
                    <Button onClick={handleUpdataComment} variant="contained" sx={{width:"100%"}} >Update Comment</Button>
                </Box>
            </Box>
        </Modal>
    </>
}