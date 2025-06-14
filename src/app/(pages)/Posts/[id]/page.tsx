import Post from '@/app/_Components/Post/Post';
import { PostType } from '@/app/_interfacess/Post.types';
import { Box, Grid } from '@mui/material';
import axios from 'axios';
import {cookies} from 'next/headers';

export default async function page({ params }: { params: { id: string } }) {
    const myCookies = await cookies();
    const token = myCookies.get("userTokenSocialApp")?.value || "";
    const {id} = await params;
    // console.log("paramsEE",params);
    

    // Get single Post
    async function getSinglePost(){

        try {
            const {data} = await axios.get(`${process.env.baseUrl}/posts/${id}`, {
            headers: {
                token: token
            }
        });
        // console.log(data);
        return data.post;
        }
        catch(error){
            console.log(error);
        }
    }

    const post: PostType | null = await getSinglePost();
    // console.log(post);

    return <>
        <Box sx={{ flexGrow: 1, py:"50px", bgcolor:"#F2F4F7"}}>
            <Grid container spacing={2}>
                <Grid size={2}>
                    
                </Grid>

                <Grid size={{xs:12, sm:8}} sx={{display:"flex", flexDirection:"column", gap:"20px", px:{xs:"30px"}}}>
                    <Post postDetails={post!} singleComment={false} />
                </Grid>

                <Grid size={2}>
                    
                </Grid>
            </Grid>
        </Box>
    </>
}
