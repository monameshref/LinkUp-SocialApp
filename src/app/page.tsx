import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Post from './_Components/Post/Post';
import { PostType } from './_interfacess/Post.types';
import PostCreation from './_Components/PostCreation/PostCreation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export default async function page() {

    const myCookies = await cookies();
    const userToken = myCookies.get("userTokenSocialApp")?.value;

    // Get All Posts
    async function getAllPosts(){
        const res = await fetch(`${process.env.baseUrl}/posts`, {
            headers: {
                // فاضي string ولو مش موجودة رجّعلي cookies هاتلي القيمة اللي جوا ال
                token: myCookies.get("userTokenSocialApp")?.value || ""

                /*
                    ولا تحذير Error فبلاش تعمليلي null ولا undefined أنا متأكدة 100% إن القيمة دي مش TypeScript يعني بتقولي للـ
                        * token: cookies.get("userTokenSocialApp")!
                */
            }
        });

        const finalRes = await res.json();
        // console.log(finalRes);

        return finalRes.posts;
    }

    const allPosts:PostType[] = await getAllPosts();

    // لو مفيش توكن، نعمل redirect للـ login
    if (!userToken) {
        redirect('/login'); // هنا بتحطي مسار صفحة الدخول عندك
    }


    return (
        <Box sx={{ flexGrow: 1, py:"50px", bgcolor:"#F2F4F7"}}>
            <Grid container spacing={2}>
                <Grid size={2}>
                    
                </Grid>

                <Grid size={{xs:12, sm:8}} sx={{display:"flex", flexDirection:"column", gap:"20px", py:"50px", px:{xs:"30px"}}}>

                    {/* Post Creation Design */}
                    <PostCreation />

                    {/* Display All Posts */}
                    { allPosts?.map((post) => { return <Post key={post._id} postDetails={post} singleComment={true} />}) }

                </Grid>

                <Grid size={2}>
                    
                </Grid>
            </Grid>
        </Box>
    );
}
