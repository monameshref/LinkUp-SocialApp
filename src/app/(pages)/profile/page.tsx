import MyPosts from "@/app/_Components/MyPosts/MyPosts";
import PostCreation from "@/app/_Components/PostCreation/PostCreation";
import Title from "@/app/_Components/Title/Title";
import { Box, Grid } from "@mui/material";

export default function Profile() {

    return <>
    {/* دى الصفحة اللى هتتعرض وهعمل صفحات تانية وهرندرها هنا  */}
        <Box sx={{ flexGrow: 1, py:"50px", bgcolor:"#F2F4F7"}}>
            <Grid container spacing={2}>
                <Grid size={2}>
                    
                </Grid>

                <Grid size={{xs:12, md:8}} sx={{display:"flex", flexDirection:"column", gap:"20px", px:{xs:"30px"}}}>
                    <PostCreation />
                    <Title />
                    <MyPosts />
                </Grid>

                <Grid size={2}>
                    
                </Grid>
            </Grid>
        </Box>
    </>
    }
