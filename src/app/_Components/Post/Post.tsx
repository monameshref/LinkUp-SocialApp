"use client";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Menu, MenuItem, Modal, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CommentIcon from '@mui/icons-material/Comment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ReplySharpIcon from '@mui/icons-material/ReplySharp';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { PostType } from '@/app/_interfacess/Post.types';
import Comments from '../Comments/Comments';
import { jwtDecode } from "jwt-decode";
import cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import Upload from '../Upload/Upload';
import cookie from "js-cookie";




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


export default function Post({postDetails, singleComment}: {postDetails:PostType, singleComment:boolean}) {

    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState("");
    const [loggedInID, setLoggedInID] = useState("");

    const token = cookies.get("userTokenSocialApp");
    const router = useRouter();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => {
        setOpenModal(true);
        inputRef.current?.blur();
    };
    const handleCloseModal = () => setOpenModal(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const captionInput = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);


    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCommentClick = () => {
        setShowCommentInput(prev => !prev);
    };

    // Delete Post
    function handleDeletePost() {
        try {
            axios.delete(`${process.env.baseUrl}/posts/${postDetails._id}`,
                {headers: {
                    token: token
                }}
            );
            toast.success("Delete Post...");
            router.refresh();
            handleClose();
        }
        catch(error){
            console.log(error);
        }
    }

    // Update Post
    async function handleUpdatePost(){
        const payload = new FormData();
        // payload.append("body", captionInput.current?.value);
        // payload.append("image", imageInputRef.current?.files[0]);

        if (captionInput.current?.value) {
            payload.append("body", captionInput.current.value);
        }
        if (imageInputRef.current?.files?.[0]) {
        payload.append("image", imageInputRef.current.files[0]);
        }

        await axios.put(`${process.env.baseUrl}/posts/${postDetails._id}`,payload,{
            headers:{
                token: cookie.get("userTokenSocialApp")!,
            }
        }).then(()=> {
            toast.success("Update Add...");
            router.refresh();
            handleCloseModal();
            handleClose();
        }).catch((error)=> {
            console.log(error);
        });
    }

    useEffect(()=>{
        const userData:{user:string} = jwtDecode(token!);
        setLoggedInID(userData.user);
    },[token]);

    // Create Comment
    const contentElement = useRef<HTMLDivElement | null>(null);
    function handleCreateComment(){
        const contentData = contentElement.current?.innerHTML || "";
        const body = {
            content: contentData,
            post: postDetails._id
        }

        try {
            axios.post(`${process.env.baseUrl}/comments`,body,{
                headers:{
                    token: cookie.get("userTokenSocialApp")!,
                }
            });
            toast.success("Add Comment...");
            router.refresh();
            setComment("");
            setShowCommentInput(false);
        }
        catch(error){
            console.log(error);
        }
    }

    return <>
        <Card sx={{border:"1px solid #00000021", mt:"50px"}}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" sx={{bgcolor:"transparent"}}>
                        <Image width={40} height={40} src={postDetails.user.photo} alt={postDetails.user.name} />
                    </Avatar>
                }
                action={
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        { loggedInID == postDetails.user._id ? <>
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
                                <MenuItem onClick={handleDeletePost}> <DeleteIcon /> Delete Post </MenuItem>
                                <MenuItem onClick={handleOpenModal}> <ModeEditIcon /> Edit Post </MenuItem>
                            </Menu>
                            </> : ""}
                    </Box>
                }
                title={postDetails.user.name}
                subheader={`${new Date(postDetails.createdAt).getFullYear()} / ${new Date(postDetails.createdAt).getMonth() + 1} at
                        ${new Date(postDetails.createdAt).getHours() > 12 ? new Date(postDetails.createdAt).getHours() -12 : new Date(postDetails.createdAt).getHours()}:${new Date(postDetails.createdAt).getMinutes()}:${new Date(postDetails.createdAt).getSeconds()}`}
                />

            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {postDetails.body}
                </Typography>
            </CardContent>

            {!!postDetails.image && <CardMedia
                component="img"
                image={postDetails.image} sx={{border:"1px solid #00000021", borderRadius:"5px", objectFit:"contain"}} 
                alt={postDetails.body} />
            }

            <CardActions sx={{display:"flex", justifyContent:"space-evenly", borderBlock:"1px solid #00000021", m:"20px", mb:"0px"}}>
                <Box sx={{display:"flex", alignItems:"center"}}>
                    <IconButton aria-label="add to favorites">
                        <ThumbUpAltIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{cursor:"pointer"}}>Like</Typography>
                </Box>

                <Box onClick={handleCommentClick} aria-label="comment" sx={{display:"flex", alignItems:"center"}}>
                    <IconButton aria-label="Comment">
                        <CommentIcon />
                    </IconButton>
                        <Typography variant="body2" sx={{cursor:"pointer"}}>Comment</Typography>
                </Box>

                <Box sx={{display:"flex", alignItems:"center"}}>
                    <IconButton aria-label="share">
                        <ReplySharpIcon sx={{ transform: 'scaleX(-1)' }} />
                    </IconButton>
                    <Typography variant="body2" sx={{cursor:"pointer"}}>Share</Typography>
                </Box>
            </CardActions>

            {/* عشان اعرض البوكس بتاع الكومنت */}
            {showCommentInput && <> <Box sx={{position:"relative", mb:"20px", mx:"10px"}}>
                        <TextField
                            fullWidth
                            placeholder="Write a Comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{ mt: 2 }}
                            ref={contentElement}
                            />
                            <Box onClick={handleCreateComment}>
                                <SendIcon sx={{position:"absolute", right:"10px", top:"50%", cursor:"pointer"}} />
                            </Box>
                    </Box>
            </>}

            <Comments comment={postDetails} singleComment={singleComment} />

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>

                    <Box>
                        <Typography variant="h5" sx={{textAlign:"center", borderBottom:"1px solid #ccc", width:"100%", pb:"10px", mb:"20px"}}>Update Post</Typography>
                    </Box>
                    <TextField inputRef={captionInput} sx={{mb:"10px", bgcolor:"#dddddd52"}} fullWidth multiline placeholder="What's On Your Mind ?" />
                    <Upload imageInputRef={imageInputRef} />
                    <Box sx={{textAlign:"center", width:"100%", my:"20px"}}>
                        <Button onClick={handleUpdatePost} variant="contained" sx={{width:"100%"}} >Update Post</Button>
                    </Box>
                </Box>
            </Modal>
        </Card>
    </>
}
